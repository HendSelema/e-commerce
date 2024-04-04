import { Router } from "express";
import * as productController from "./product.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { endPointsRoles } from "./product.endpoint.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./product.validation.js";


const router=Router()

router.post('/add',
auth(endPointsRoles.ADD_PRODUCT),
validationMiddleware(validators.addSchema),
multerMiddleHost({extensions:allowedExtensions.image}).array('image',3),
expressAsyncHandler(productController.addProduct))

router.put('/:productId',
auth(endPointsRoles.ADD_PRODUCT),
validationMiddleware(validators.updateSchema),
multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(productController.updateProduct))

router.delete('/:productId',
auth(endPointsRoles.ADD_PRODUCT),
validationMiddleware(validators.deleteSchema),
expressAsyncHandler(productController.deleteProduct))

router.get('/:productId',
validationMiddleware(validators.getProductSchema),
expressAsyncHandler(productController.getProduct))

router.get('/',
expressAsyncHandler(productController.getAllProducts))


export default router
