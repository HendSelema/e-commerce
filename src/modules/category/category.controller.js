import slugify from "slugify"
import Category from "../../../DB/models/category.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import { nanoid } from "nanoid"

// ................ add category...........
export const addCategory = async (req,res,next)=>{
    // 1- destruct the request data body
    const {name}=req.body
    const {_id}=req.authUser

    // 2-check if category name already exist
    const isNameDublicated = await Category.findOne({name}) 
    if(isNameDublicated){
        return next({cause:409 , message:"category name is already exist"})
    }
    // 3- generate slug
    const slug =slugify(name ,'-')

   // 4- upload on cloudinary image
   if(!req.file)return next({cause:400 , message:"image is required"})
   const folderId = nanoid(4)
   const {secure_url ,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
    folder:`${process.env.MAIN_FOLDER}/Categories/${folderId}`
   })

//5- generate the category object
const category ={
    name,
    slug,
    Image:{secure_url, public_id},
    folderId,
    addedBy:_id
}

//  6- create category
const categoryCreated = await Category.create(category)
res.status(201).json({
    success:true ,
     message:"category created successfully",
    data: categoryCreated

    })

}

// .............update category..................................
 export const updateCategory =async(req,res,next)=>{
    // 1-destructing the request body
    // 2-destructing the request query
    // 3-destructing the _id from the request authUser
    const {name ,oldPublicId}=req.body
    const {categoryId}=req.query
    const {_id}=req.authUser
//  4- check if category is already exist by using category id
    const category= await Category.findById(categoryId)
    if(!category)return next({cause:404 , message:'Category not found'})
// 5- check if user want to update name of category
if(name){
    // 5.1- check if the new name is different from old name
    if(name == category.name){
            return next({cause:409 ,message:"please enter differnet category name from the existing one"})
    }
    // 5.2- check if the new name is already exist
    const isNameDublicated = await Category.findOne({name}) 
    if(isNameDublicated){
        return next({cause:409 , message:"category name is already exist"})
    }
    // 5.3- update the category name and the category slug 
    category.name =name
    category.slug=slugify(name ,'-')
}   

// 6- check if user want to update Image (oldPublicId) of category
if(oldPublicId){
    console.log(oldPublicId);

    if(!req.file)return next({cause:400 , message:"image is required"})
    const newPublicId = oldPublicId.split(`${category.folderId}/`)[1]
console.log(newPublicId)
    const{secure_url ,public_id}= await cloudinaryConnection().uploader.upload(req.file.path,{
            folder:`${process.env.MAIN_FOLDER}/Categories/${category.folderId}`,
            public_id: newPublicId
        })
        console.log(public_id);
        category.Image.secure_url= secure_url
}
// 7- set value for updatedBy field
category.updatedBy = _id
await category.save()
res.status(200).json({success:true , message: "category updated successfully", data:category})
}

// ............get all category.....................
export const getAllCategory=async(req,res,next)=>{
    const categories=await Category.find()
    res.status(200).json({success:true , message: "category fetched successfully",data:categories})
}


// ...............delete category...........
export const deleteCategory =async(req,res,next)=>{
    // 2-destructing the request query
    // 3-destructing the _id from the request authUser
    const {categoryId}=req.query
    const {_id}=req.authUser
//  4- check if category is already exist by using category id
    const category= await Category.findById(categoryId)
    if(!category)return next({cause:404 , message:'Category not found'})

const deletedCategory=await Category.findByIdAndDelete(categoryId)
if(!deletedCategory){
    res.status(303).json({success:false , message: "category deleted failed"})
}

res.status(200).json({success:true , message: "category deleted successfully"})
}


