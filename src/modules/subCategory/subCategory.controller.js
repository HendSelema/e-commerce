import slugify from "slugify"
import Category from "../../../DB/models/category.model.js"
import SubCategory from "../../../DB/models/sub-category.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import { nanoid } from "nanoid"



// ................ add SubCategory...........
export const addSubCategory = async (req,res,next)=>{
    // 1- destruct the request data body
    const {name}=req.body
    const {categoryId}=req.query
    const {_id}=req.authUser


    // 2-check if SubCategory name already exist
    const isNameDublicated = await SubCategory.findOne({name}) 
    if(isNameDublicated){
        return next({cause:409 , message:"SubCategory name is already exist"})
    }

    // 3-check if category  exist by using categoryId
    const category =await Category.findById(categoryId)
    if(!category)return res.status(404).json({messsage:"category not found"})

    // 4- generate slug
    const slug =slugify(name ,'-')

   // 5- upload on cloudinary image
   if(!req.file)return next({cause:400 , message:"image is required"})
   const folderId = nanoid(4)
   const {secure_url ,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
    folder:`${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${folderId}`
   })

//6- generate the SubCategory object
const subCategory ={
    name,
    slug,
    Image:{secure_url, public_id},
    folderId,
    addedBy:_id,
    categoryId
}

//  7- create SubCategory
const subCategoryCreated = await SubCategory.create(subCategory)
res.status(201).json({
    success:true ,
    message:"SubCategory created successfully",
    data:subCategoryCreated
    })
}

