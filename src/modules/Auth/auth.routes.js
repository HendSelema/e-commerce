import { Router } from "express";
import * as userAuthController from "../Auth/auth.controller.js";
import expressAsyncHandler from "express-async-handler";

const router= Router()

router.post('/signUp',expressAsyncHandler(userAuthController.signUp))
router.get('/verify-email',expressAsyncHandler(userAuthController.verifyEmail))
router.post('/login',expressAsyncHandler(userAuthController.signin))
export default router


