import slugify from "slugify"
import Category from "../../../DB/models/category.model.js"
import SubCategory from "../../../DB/models/sub-category.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import { systemRoles } from "../../utils/system-roles.js"
import brand from "../../../DB/models/brand.model.js"
import Product from "../../../DB/models/product.model.js"
import { APIFeatures } from "../../utils/api-features.js"



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

//....................... update subcategory...............
export const updateSubcategory=async(req,res,next)=>{
    // superadmin
    // admin
    const {_id}=req.authUser
    // data
    const {name,oldPublicId}=req.body
    // subcategoryId
    const {subcategoryId}=req.params
    // subCategory check
    const subCategory= await SubCategory.findById(subcategoryId)
    if(!subCategory)return next({message:"subcategory not found"})
   

    // auth check

     if(
        req.authUser.role !== systemRoles.ADMIN && 
        subCategory.addedBy.toString() !==_id.toString()
        ) 
         return next({message:"you are not allowed to update subCategory"})
    
// name
if (name){
    if(name == subCategory.name){
        return next({cause:409 ,message:"please enter differnet subCategory name from the existing one"})
}
    subCategory.name = name
    const slug =slugify(name,{lower:true,replacement:"-"})
    subCategory.slug=slug
} 

// images
// check if user want to update Image (oldPublicId) 
if(oldPublicId){

    if(!req.file)return next({cause:400 , message:"image is required"})
    
    const newPublicId = oldPublicId.split(`${subCategory.folderId}/`)[1]
    console.log(newPublicId)
    const { secure_url ,public_id }= await cloudinaryConnection().uploader.upload(req.file.path,{
         folder:`${oldPublicId.split(`${subCategory.folderId}/`)[0]}${subCategory.folderId}`,
        public_id: newPublicId
        })
        console.log(public_id);

        subCategory.Image.secure_url= secure_url

}

// set value for updatedBy field
subCategory.updatedBy = _id

const updatedSubCategory =await subCategory.save()
res.status(200).json({success:true,message:"subCategory updated successfully",data:updatedSubCategory})
}

// .....................delete subcategory................
export const deleteSubCategory =async(req,res,next)=>{
 
     const {subCategoryId}=req.params
     // subCategory check
     const subCategory= await SubCategory.findById(subCategoryId)
     if(!subCategory)return next({message:"subcategory not found"})
     const category =await Category.findById(subCategory.categoryId)
// delete related brands
const brandcheck=await brand.deleteMany({subCategoryId})
if(brandcheck.deletedCount <=0){
    console.log(brandcheck.deletedCount);
    console.log("there is no related brands");
}
// delete related products
const productcheck=await Product.deleteMany({subCategoryId})
if(productcheck.deletedCount <=0){
    console.log(productcheck.deletedCount);
    console.log("there is no related products");
}
// delete all images
await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${subCategory.folderId}`)
await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${subCategory.folderId}`)
     const subCategoryDeleted= await SubCategory.findByIdAndDelete(subCategoryId)
    if(!subCategoryDeleted){
        res.json({success:false , message: "subcategory deleted failed"})}
res.status(200).json({success:true , message: "subcategory deleted successfully"})
}

// .................... get subcategory by id ........
export const getsubcategory = async(req,res,next)=>{
    // id subcategory
    const {subCategoryId}=req.params
    // check subcategory
    const subcategoryExist=await SubCategory.findById(subCategoryId)
    if(!subcategoryExist)return next({cause:404 , message:'subcategory not found'})
    res.status(200).json({success:true , message: "subcategory fetched successfully",data:subcategoryExist})

}


// ........... get all subcategory for specific category...............

export const subcategoryForCategory = async(req,res,next)=>{
    // id category
    const {categoryId}=req.query
    // check category
    const category=await Category.findById(categoryId)
    if(!category)return next({cause:404 , message:'this category not found'})
    
    const subcategory= await SubCategory.find({categoryId:category._id})

        res.status(200).json({
            success:true ,
             message: "subcategory fetched successfully",
             data:subcategory
            })


}

// ............apply api features in subcategory ..................

export const getAllSubcategory = async(req,res,next)=>{
    const {page,size,sort, ...query}=req.query

    const features=new APIFeatures(req.query, SubCategory.find())
    .pagination({ page,size })
    .sort(sort)
    // .search(query)
    .filter(query)
    const Subcategories=await features.mongooseQuery
        res.status(200).json({success:true ,data:Subcategories})

}
