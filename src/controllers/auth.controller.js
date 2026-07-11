import {asyncHandler} from '../utils/AsyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const options = {
    httpOnly: true,
    secure: true
}
const generateAccessAndRefreshToken = async (userID)=>{
    try{
        const user = await User.findById(userID).select("-password -mpin")
        console.log("gar",user)

        const accessToken = user.generateAccessToken()
        console.log(0)

        const refreshToken = user.generateRefreshToken()
        console.log(1)
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        
        return {accessToken , refreshToken}
    }catch(error){
        throw new ApiError(500, `Error while generating token${error}`)
    }

}
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
    
    const user = await User.create({
        name,
        email,
        phone,
        password
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

const loginUser = asyncHandler(async (req,res)=>{
    //req.body -> data
    //check for email or phone which ever present 
    //check if user exists
    //check for password 
    //generate tokens
    //send cookie with token

    const { email , phone , password} = req.body

    if(!(email||phone)){
        throw new ApiError(400 , " email or phone is required for login")
    }
    const userExists = await User.findOne(
        {
            $or: [{email}, {phone}]
        }
    )

    if(!userExists){
        throw new ApiError(404 , "User does not exists.")
    }

    const isPassCorrect = await userExists.isPasswordCorrect(password)

    if(!isPassCorrect){
        throw new ApiError(401,"Invalid Credentials")
    }

    const {accessToken , refreshToken } = await generateAccessAndRefreshToken(userExists._id)

    const userLoggedIn = await User.findById(userExists._id).select("-password -mpin")

    return res
    .status(200)
    .cookie("accessToken" , accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,{userLoggedIn},"LoggedIn successfully"
    ))
})

const logoutUser = asyncHandler(async (req,res)=>{
    //check whether the user is loggedin 
    // if yes clear the cookie from the the database and the cookie from the browser
    //and loggout is done
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },{
            new: true
        }
    )
    
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"logout successfull")
    )

})

const setMpin = asyncHandler(async (req,res)=>{
    //take input mpin and password to setup the mpin
    //check whether mpin and password entered
    //use req.user from verifyJWT to find the user from database and load the user as userloggedin
    //verify that the password is correct 
    //set mpin
    const { mpin , password }= req.body

    if(!mpin && !password){
        throw new ApiError(401,"please enter mpin to setup mpin")
    }
    const userLoggedin = await User.findById(req.user?._id)
    const isPassCorrect = await userLoggedin.isPasswordCorrect(password)
    if(!isPassCorrect){
        throw new ApiError(403, " Enter correct password to setup Mpin")
    }
    userLoggedin.mpin = mpin
    const isMpinset = await userLoggedin.save()
    if(!isMpinset){
        throw new ApiError(403, " error while mpin setup")
    }
    console.log(userLoggedin)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {},"mpin setup successfull")
    )

})
export {registerUser , loginUser, logoutUser, setMpin}