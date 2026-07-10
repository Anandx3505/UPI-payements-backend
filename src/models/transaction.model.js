import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum:['TRANSFER','ADD_MONEY','WITHDRAW', 'BILL_PAY'],
            default: 'TRANSFER'
        },
        amount:{
            type: Number,
            required:true
        },
        status:{
            type: String,
            enum:['SUCCESS', 'FAILED','PENDING'],
            default: 'SUCCESS'
        }
    },
    {
        timestamps:true
    }
)

export const Transaction = mongoose.model('Transaction', transactionSchema)