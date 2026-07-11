import { Router } from 'express';
import {registerUser, loginUser, setMpin, logoutUser} from '../controllers/auth.controller.js';
import {verifyJWT} from '../middleware/auth.middleware.js'

const authRouter = Router();

authRouter.route("/register").post(registerUser)
authRouter.route("/login").post(loginUser)
authRouter.route("/setMpin").post(verifyJWT,setMpin)
authRouter.route("/logoutUser").post(verifyJWT,logoutUser)

export default authRouter;
