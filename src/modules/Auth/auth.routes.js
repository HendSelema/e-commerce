import { Router } from "express";
import * as userAuthController from "../Auth/auth.controller.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./auth.validation.js";



const router= Router()

router.post('/signUp',
validationMiddleware(validators.signUpSchema),
expressAsyncHandler(userAuthController.signUp))

router.get('/verify-email',
validationMiddleware(validators.verifyEmailSchema),
expressAsyncHandler(userAuthController.verifyEmail))

router.post('/login',
validationMiddleware(validators.signinSchema),
expressAsyncHandler(userAuthController.signin))

export default router


