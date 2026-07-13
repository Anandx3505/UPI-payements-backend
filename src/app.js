import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import txnRouter from './routes/txn.routes.js';
import authRouter from './routes/auth.routes.js';
import walletRouter from './routes/wallet.routes.js'
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

let swaggerFile = null;
try {
  swaggerFile = JSON.parse(fs.readFileSync('./swagger_output.json', 'utf-8'));
} catch (err) {
  console.warn("Swagger output not found, run 'npm run swagger'");
}

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/txn", txnRouter)
app.use("/api/v1/wallet", walletRouter)

if (swaggerFile) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

app.get("/api/v1/", (req,res)=>{
    res.send("Welcome to the UPI App")
})

export {app}

