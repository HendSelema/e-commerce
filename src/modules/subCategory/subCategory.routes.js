import { Router } from "express";
import * as subCatController from "../../modules/subCategory/subCategory.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./subCategory.endPoins.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
multerMiddleHost

const router=Router()
 router.post('/add',
 auth(endPointsRoles.ADD_SubCATEGORY),
 multerMiddleHost({
    extensions:allowedExtensions.image
 }).single('image')
 ,
 expressAsyncHandler(subCatController.addSubCategory)
 )



export default router