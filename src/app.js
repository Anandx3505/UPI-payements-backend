import express from 'express';
import cors from 'cors';


const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))


// app.use("/api/v1/users", userRouter)

app.get("/", (req,res)=>{
    res.send("Welcome to the UPI App")
})

export {app}

