import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { users } from 'moongose/models/index.js';


const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        phone:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        upiID:{
            type: String,
            unique: true
        },
        mpin: {
            type: String,
        },
        balance:{
            type: Number,
            default: 10000
        },
        refreshToken:{
            type: String
        }
    },{
        timestamps: true
    }
)
userSchema.pre("save",async function(){
    try {
        if(this.isModified("password")){
                this.password = await bcrypt.hash(this.password ,10)
    
        }
    
        if(this.isModified("email") || !this.upiID){
            if(this.email) {
                const emailClean = this.email.split('@')[0]
                this.upiID = `${emailClean}@phonepe`
            } 
        }
        if(this.isModified("mpin")){
            this.mpin = await bcrypt.hash(this.mpin,5)
        }
    } catch (error) {
        throw new ApiError(501, "error while pre-save process.")
    }
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.isMpinCorrect  = async function(mpin){
    return await bcrypt.compare(mpin,this.mpin)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            phone: this.phone
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY  
        }
    )
}


export const User = mongoose.model('User', userSchema);