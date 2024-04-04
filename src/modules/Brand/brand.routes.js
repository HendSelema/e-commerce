import { Router } from "express";
import * as brandController from "./brand.controller.js"
import expressAsyncHandler from "express-async-handler";
import {auth} from "../../middlewares/auth.middleware.js"
// import { systemRoles } from "../../utils/system-roles.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { endPointsRoles } from "./brand.endpoints.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./brand.validation.js";



const router = Router()

// add...............
router.post('/add',
auth(endPointsRoles.ADD_BRAND),
validationMiddleware(validators.addSchema),
multerMiddleHost({
    extensions:allowedExtensions.image
}).single('image'), 
expressAsyncHandler(brandController.addBrand))


// update.............
router.put('/:brandId',
auth(endPointsRoles.ADD_BRAND),
validationMiddleware(validators.updateSchema),
multerMiddleHost({
    extensions:allowedExtensions.image
}).single('image'), 
expressAsyncHandler(brandController.updateBrand))

// delete.............
router.delete('/:brandId',
auth(endPointsRoles.ADD_BRAND), 
validationMiddleware(validators.deleteSchema),
expressAsyncHandler(brandController.deleteBrand))

// brands For Subcategory.............
router.get('/',
validationMiddleware(validators.brandsForSubcategorySchema),
expressAsyncHandler(brandController.brandsForSubcategory))

// brands For category.............
router.get('/getbrands',
expressAsyncHandler(brandController.brandsForCategory))

// getAllBrands.............
router.get('/allBrands',
expressAsyncHandler(brandController.getAllBrands))

export default router
