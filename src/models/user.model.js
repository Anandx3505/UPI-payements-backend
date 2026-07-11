import mongoose from 'mongoose';

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
        }
    },{
        timestamps: true
    }
)

export const User = mongoose.model('User', userSchema);