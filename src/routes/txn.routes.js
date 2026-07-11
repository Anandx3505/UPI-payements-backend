import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {sendViaUPI} from '../controllers/txn.controller.js'

const txnRouter = Router();

txnRouter.route("/sendviaUPI").post(verifyJWT,sendViaUPI)



export default txnRouter
