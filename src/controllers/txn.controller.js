import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const sendViaUPI = asyncHandler( async (req,res)=>{
    const { receiverUPI , amount , mpin} = req.body
    const sender = await User.findById(req.user?._id).select("-password -refreshToken")

    if(!mpin){
        throw new ApiError(400, "Mpin Required")
    }
    if(!amount && amount <1){
        throw new ApiError(401,"Amount is requried and to be more than 1.")
    }
    if(!receiverUPI){
        throw new ApiError(401, " receiverUPI is required")
    }

    if(sender.balance<amount){
        throw new ApiError(303,"insufficient balance.")
    }

    const ismpinCorrect = await sender.isMpinCorrect(mpin)
    console.log(ismpinCorrect)
    if(!ismpinCorrect){
        throw new ApiError(400, "incorrect mpin!!")
    }

    const receiver = await User.findOne({receiverUPI})
    if(!receiver){
        throw new ApiError(404, `User with ${receiverUPI} does not exists.`)
    }
    
    sender.balance -= amount
    receiver.balance += amount
    await sender.save()
    await receiver.save()

    const transaction = await Transaction.create({
        sender: sender._id,
        receiver: receiver._id,
        type:"TRANSFER",
        amount:amount,
        status:"SUCCESS"
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200 ,{transaction},"Transaction Successfully")
    )
    
})


export {sendViaUPI}