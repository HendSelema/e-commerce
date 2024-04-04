import { Router } from "express";
const router= Router()
import * as cartController from './cart.controller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";

// ...........add cart
router.post('/add',
auth(systemRoles.USER),
expressAsyncHandler(cartController.addCart))

router.put('/:productId',
auth(systemRoles.USER),
expressAsyncHandler(cartController.removeFromCart))


export default router
