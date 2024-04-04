import { Router } from "express";
import * as subCatController from "../../modules/subCategory/subCategory.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./subCategory.endPoins.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./subCategory.validation.js";


const router=Router()

// ...........add
 router.post('/add',
 auth(endPointsRoles.ADD_SubCATEGORY),
 validationMiddleware(validators.addSchema),
 multerMiddleHost({
    extensions:allowedExtensions.image
 }).single('image'),
 expressAsyncHandler(subCatController.addSubCategory)
 )

//  ...............update
 router.put('/:subcategoryId',
 auth(endPointsRoles.ADD_SubCATEGORY),
 validationMiddleware(validators.updateSchema),
 multerMiddleHost({
    extensions:allowedExtensions.image
 }).single('image'),
 expressAsyncHandler(subCatController.updateSubcategory)
 )

//  ...............delete
 router.delete('/:subCategoryId',
 auth(endPointsRoles.ADD_SubCATEGORY),
 validationMiddleware(validators.deleteSchema),
 expressAsyncHandler(subCatController.deleteSubCategory)
 )

// .................... get subcategory by id 
router.get('/:subCategoryId',
validationMiddleware(validators.getsubSchema),
expressAsyncHandler(subCatController.getsubcategory)
)

// .................... get subcategory  
router.get('/',
validationMiddleware(validators.subForCatSchema),
expressAsyncHandler(subCatController.subcategoryForCategory)
)

// .................... get all subcategory  
router.get('/allSubcat',
expressAsyncHandler(subCatController.getAllSubcategory)
)


export default router