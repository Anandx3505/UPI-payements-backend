import {asyncHandler} from '../utils/AsyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';


const registerUser = asyncHandler(async (req,res)=>{
    const {name, email, phone,password} = req.body
    console.log("name: ", name, "\nphone: ", phone);
    console.log("email: ", email, "\npassword: ", password);
    if(!(name && email && phone && password)){
        throw new ApiError(401, "Enter all required details")
    }
    let userExists = await User.findOne(
        {
            $or: [{email},{phone}]
        }
    )
    if(userExists){
        throw new ApiError(401, "User with same phone number or email Already exists.")
    }
    //hashed password
    const salt = await bcrypt.genSalt(20)
    const hashedPass = await bcrypt.hash(password,salt)
    
    //upiID
    const emailClean = email.toLowerCase()
    const upiId = `${emailClean.split('@')[0]}@phonepe`

    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPass,
        upiID: upiId
    })
    if(!user){
        throw new ApiError(402, "user not registered successfully.")
    }
    return res
        .status(200)
        .json(new ApiResponse(
            200,{user},"User created successfully"
        ))

})


export {registerUser}