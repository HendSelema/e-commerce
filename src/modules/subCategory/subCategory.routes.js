import { Router } from "express";
import * as subCatController from "../../modules/subCategory/subCategory.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./subCategory.endPoins.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerMiddleHost } from "../../middlewares/multer.js";


const router=Router()

// ...........add
 router.post('/add',
 auth(endPointsRoles.ADD_SubCATEGORY),
 multerMiddleHost({
    extensions:allowedExtensions.image
 }).single('image'),
 expressAsyncHandler(subCatController.addSubCategory)
 )

//  ...............update
 router.put('/:subcategoryId',
 auth(endPointsRoles.ADD_SubCATEGORY),
 multerMiddleHost({
    extensions:allowedExtensions.image
 }).single('image'),
 expressAsyncHandler(subCatController.updateSubcategory)
 )

//  ...............delete
 router.delete('/:subCategoryId',
 auth(endPointsRoles.ADD_SubCATEGORY),
 expressAsyncHandler(subCatController.deleteSubCategory)
 )

// .................... get subcategory by id 
router.get('/:subCategoryId',
expressAsyncHandler(subCatController.getsubcategory)
)

// .................... get subcategory  
router.get('/',
expressAsyncHandler(subCatController.subcategoryForCategory)
)

// .................... get all subcategory  
router.get('/allSubcat',
expressAsyncHandler(subCatController.getAllSubcategory)
)


export default router