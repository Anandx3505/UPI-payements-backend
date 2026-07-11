import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {sendViaUPI, getTransaction} from '../controllers/txn.controller.js'

const txnRouter = Router();

txnRouter.route("/sendviaUPI").post(verifyJWT,sendViaUPI)
txnRouter.route("/getTransaction").post(verifyJWT,getTransaction)



export default txnRouter
