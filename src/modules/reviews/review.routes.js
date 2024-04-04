import { Router } from "express";
import * as reviewController from "./review.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./review.endpoints.js";
import * as validators from "./review.validation.js";


const router=Router()
 
router.post('/',
auth(endPointsRoles.ADD_REVIEW),
validationMiddleware(validators.addReviewSchema),
expressAsyncHandler(reviewController.addReview))


export default router
