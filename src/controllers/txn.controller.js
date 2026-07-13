import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";

// @desc    Send money to another user via UPI ID
// @route   POST /api/v1/txn/sendviaUPI
// @access  Private
const sendViaUPI = asyncHandler(async (req, res) => {

    const { receiverUPI, amount, mpin } = req.body

    if (!mpin) {
        throw new ApiError(400, "Mpin Required")
    }
    if (!amount && amount < 1) {
        throw new ApiError(401, "Amount is requried and to be more than 1.")
    }
    if (!receiverUPI) {
        throw new ApiError(401, " receiverUPI is required")
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const sender = await User.findById(req.user?._id).select("-password -refreshToken").session(session);
        if (!sender) {
            throw new ApiError(404, "Sender not found")
        }

        if (sender.balance < amount) {
            throw new ApiError(303, "insufficient balance.")
        }

        const ismpinCorrect = await sender.isMpinCorrect(mpin)
        if (!ismpinCorrect) {
            throw new ApiError(400, "incorrect mpin!!")
        }

        const receiver = await User.findOne({ receiverUPI }).session(session);
        if (!receiver) {
            throw new ApiError(404, `User with ${receiverUPI} does not exists.`)
        }

        //concurrency control when updating balances
        const updatedSender = await User.findOneAndUpdate(
            { _id: sender._id, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { new: true, session }
        );

        if (!updatedSender) {
            throw new ApiError(400, "Insufficient balance or concurrent transaction occurred.");
        }

        const updatedReceiver = await User.findOneAndUpdate(
            { _id: receiver._id },
            { $inc: { balance: amount } },
            { new: true, session }
        );

        if (!updatedReceiver) {
            throw new ApiError(400, "Failed to update receiver balance.");
        }

        const transaction = await Transaction.create([{
            sender: sender._id,
            receiver: receiver._id,
            type: "TRANSFER",
            amount: amount,
            status: "SUCCESS"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return res
            .status(200)
            .json(
                new ApiResponse(200, { transaction: transaction[0] }, "Transaction Successfully")
            )
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
})

// @desc    Get transaction history for the logged in user
// @route   POST /api/v1/txn/getTransaction
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({
        sender: req.user?._id
    })
    if (!transactions) {
        throw new ApiError(400, "can't fetech transaction history.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { transactions }, "transaction fetched successfully.")
        )
})


export { sendViaUPI, getTransaction }