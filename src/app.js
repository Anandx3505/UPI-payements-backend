import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))


app.use("/api/v1/auth", authRouter)


app.get("/", (req,res)=>{
    res.send("Welcome to the UPI App")
})

export {app}

