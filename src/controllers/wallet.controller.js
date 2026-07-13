import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { User } from "../models/user.model.js"
import { Transaction } from "../models/transaction.model.js"
import mongoose from "mongoose";

const addMoney = asyncHandler(async (req, res) => {
    const { amount, password } = req.body
    if (amount === undefined) throw new ApiError(401, "amount is required")
    if (!password) throw new ApiError(401, "Password is required")

    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) throw new ApiError(401, "Amount must be a positive number.")

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(req.user?._id).select("-mpin -refreshToken").session(session);
        if (!user) throw new ApiError(404, "user not found.")

        const isPassCorrect = await user.isPasswordCorrect(password)
        if (!isPassCorrect) {
            throw new ApiError(402, "invalid password.!!")
        }

        //Concurrency control
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $inc: { balance: amt } },
            { new: true, session }
        );

        if (!updatedUser) {
            throw new ApiError(400, "Failed to update balance.");
        }

        //log transaction 
        const transaction = await Transaction.create([{
            sender: updatedUser._id,
            type: "ADD_MONEY",
            amount: amt,
            status: "SUCCESS"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { transaction: transaction[0] },
                "Money added successfully."
            ))
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
})


const withdrawMoney = asyncHandler(async (req, res) => {
    const { amount, mpin } = req.body
    if (amount === undefined) throw new ApiError(401, "amount is required")
    if (!mpin) throw new ApiError(401, "Mpin is required")

    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) throw new ApiError(401, "Amount must be a positive number.")

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(req.user?._id).session(session);
        if (!user) throw new ApiError(404, "No user Found.")
        if (user.balance < amt) throw new ApiError(402, "Insufficient Balance.Please try with lower amount")

        const ismpinCorrect = await user.isMpinCorrect(mpin)
        if (!ismpinCorrect) throw new ApiError(401, "Mpin incorrect!!")

        //Concurrency control to prevent double withdraw
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id, balance: { $gte: amt } },
            { $inc: { balance: -amt } },
            { new: true, session }
        );

        if (!updatedUser) {
            throw new ApiError(400, "Insufficient balance or concurrent transaction occurred.");
        }

        const transaction = await Transaction.create([{
            sender: updatedUser._id,
            amount: amt,
            type: "WITHDRAW",
            status: "SUCCESS"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return res
            .status(200)
            .json(
                new ApiResponse(200, { transaction: transaction[0] }, `${amt} withdrawn successfully.`)
            )
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
})

export { addMoney, withdrawMoney }
