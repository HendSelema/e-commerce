import { Router } from "express";
import * as productController from "./product.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { endPointsRoles } from "./product.endpoint.js";

const router=Router()

router.post('/add',
auth(endPointsRoles.ADD_PRODUCT),
multerMiddleHost({extensions:allowedExtensions.image}).array('image',3),
expressAsyncHandler(productController.addProduct))

router.put('/:productId',
auth(endPointsRoles.ADD_PRODUCT),
multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(productController.updateProduct))

router.delete('/:productId',
auth(endPointsRoles.ADD_PRODUCT),
expressAsyncHandler(productController.deleteProduct))

router.get('/:productId',
expressAsyncHandler(productController.getProduct))

router.get('/',
expressAsyncHandler(productController.getAllProducts))


export default router
