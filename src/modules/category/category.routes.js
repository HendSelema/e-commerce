import { Router } from "express";
const router= Router()
import * as categoryController from './category.controller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { endPointsRoles } from "./category.endPoints.js";

// ...........add
router.post('/add',
auth(endPointsRoles.ADD_CATEGORY),
multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(categoryController.addCategory))

// ............update
router.put('/update',
auth(endPointsRoles.ADD_CATEGORY),
multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(categoryController.updateCategory))

// ............delete
router.delete('/delete',
auth(endPointsRoles.ADD_CATEGORY),
expressAsyncHandler(categoryController.deleteCategory))

// ............getAllCategory
router.get('/',
expressAsyncHandler(categoryController.getAllCategory))

// ............get Category by id
router.get('/:categoryId',
expressAsyncHandler(categoryController.getcategory))



export default router
