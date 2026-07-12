import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import {User} from "../models/user.model.js"
import {Transaction} from "../models/transaction.model.js"

const addMoney = asyncHandler( async (req,res)=>{
    const {amount , password} = req.body
    if(amount === undefined) throw new ApiError(401,"amount is required")
    if(!password) throw new ApiError(401,"Password is required")
    
    const amt = Number(amount)
    if(!Number.isFinite(amt)|| amt<=0) throw new ApiError(401,"Amount must be a positive number.")

    const user = await User.findById(req.user?._id).select("-mpin -refreshToken")
    if(!user) throw new ApiError(404,"user not found.")

    const isPassCorrect = await user.isPasswordCorrect(password)
    if(!isPassCorrect){
        throw new ApiError(402,"invalid password.!!")
    }
    user.balance += amt
    const updated = await user.save()
    //log transaction 
    const transaction = await Transaction.create({
        sender: updated._id,
        type: "ADD_MONEY",
        amount: amt,
        status: "SUCCESS"
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {transaction},
        "Money added successfully."
    ))

})


const withdrawMoney = asyncHandler( async (req,res)=>{
    const {amount , mpin} = req.body
    if(amount === undefined) throw new ApiError(401,"amount is required")
    if(!mpin) throw new ApiError(401,"Mpin is required")

    const amt = Number(amount)
    if(!Number.isFinite(amt)|| amt<=0) throw new ApiError(401,"Amount must be a positive number.")

    const user = await User.findById(req.user?._id)
    if(!user) throw new ApiError(404,"No user Found.")
    if(user.balance<amt) throw new ApiError(402,"Insufficient Balance.Please try with lower amount")
    
    const ismpinCorrect = await user.isMpinCorrect(mpin)
    if(!ismpinCorrect) throw new ApiError(401,"Mpin incorrect!!")
    
    user.balance -= amt
    const updated = await user.save()

    const transaction = await Transaction.create({
        sender: updated._id,
        amount: amt,
        type: "WITHDRAW",
        status: "SUCCESS"
    })
    return res
    .status(200)
    .json(
        new ApiResponse(200,{transaction},`${amt} withdrawn successfully.`)
    )
    
})

export { addMoney, withdrawMoney}
