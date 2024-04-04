import { Router } from "express";
const router= Router()
import * as userController from "./user.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./user.validation.js";

router.put('/update'
,auth([systemRoles.USER]),
validationMiddleware(validators.updateSchema),
expressAsyncHandler(userController.updateUser))

router.delete('/delete',auth([systemRoles.USER]),expressAsyncHandler(userController.deleteUser))

router.get('/get',auth([systemRoles.USER]),expressAsyncHandler(userController.getUserData))


export default router