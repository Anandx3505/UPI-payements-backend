import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addMoney } from "../controllers/wallet.controller.js"


const walletRouter = Router();

walletRouter.route("/addMoney").post(verifyJWT,addMoney)

export default walletRouter