import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addMoney, withdrawMoney } from "../controllers/wallet.controller.js"


const walletRouter = Router();

walletRouter.route("/addMoney").post(verifyJWT,addMoney)
walletRouter.route("/withdrawMoney").post(verifyJWT,withdrawMoney)

export default walletRouter