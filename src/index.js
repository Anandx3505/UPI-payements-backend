import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

//initialize environmental variables
dotenv.config()
const port = process.env.PORT || 3000
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at ${port}`);
        })
    })
    .catch((error)=>{
        console.log("error starting server !!", console.error);
    })



