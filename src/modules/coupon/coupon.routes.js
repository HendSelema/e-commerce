import { Router } from "express";
import * as couponController from "./coupon.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./coupon.endpoints.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./coupon.validation.js";

const router=Router()

router.post('/add',
auth(endPointsRoles.ADD_COUPON),
validationMiddleware(validators.addCouponSchema)
,expressAsyncHandler(couponController.addCoupon))

router.post('/valid',
auth(endPointsRoles.ADD_COUPON)
,expressAsyncHandler(couponController.validateCouponApi))

router.get('/getAll',
auth(endPointsRoles.ADD_COUPON),
expressAsyncHandler(couponController.getAllCoupons))

router.get('/',
auth(endPointsRoles.ADD_COUPON),
expressAsyncHandler(couponController.getCoupon))

router.put('/',
auth(endPointsRoles.ADD_COUPON),
expressAsyncHandler(couponController.updateCoupon))



export default router