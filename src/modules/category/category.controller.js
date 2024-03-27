import slugify from "slugify"
import Category from "../../../DB/models/category.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import subCategory from "../../../DB/models/sub-category.model.js"
import brand from "../../../DB/models/brand.model.js"
import { APIFeatures } from "../../utils/api-features.js"

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
   console.log(`${process.env.MAIN_FOLDER}/Categories/${folderId}`);
   req.folder=`${process.env.MAIN_FOLDER}/Categories/${folderId}`
//    const x=2
//    x=4
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
req.savedDocument={model:Category , _id:categoryCreated._id}
//    const x=2
//    x=4
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

// // ............get all category.....................
// export const getAllCategory=async(req,res,next)=>{
//     const categories=await Category.find().populate(
//         [{path:'subCategories',populate:[{path:'Brands'}]}]
//         )
//     console.log(categories);
//     res.status(200).json({success:true , message: "category fetched successfully",data:categories})
// }

// ......................features Category.. get all category

export const getAllCategory = async(req,res,next)=>{
    const {page,size,sort, ...query}=req.query

    const features=new APIFeatures(req.query, Category.find())
    .pagination({ page,size })
    // .sort(sort)
    // .search(query)
    .filter(query)
    const Categories=await features.mongooseQuery
        res.status(200).json({success:true ,data:Categories})

}

// .................... get category by id ........
export const getcategory = async(req,res,next)=>{
    // id category
    const {categoryId}=req.params
    // check category
    const categoryExist=await Category.findById(categoryId)
    if(!categoryExist)return next({cause:404 , message:'Category not found'})
    res.status(200).json({success:true , message: "category fetched successfully",data:categoryExist})

}

// ...............delete category...........
export const deleteCategory =async(req,res,next)=>{
    // 2-destructing the request query
    // 3-destructing the _id from the request authUser
    const {categoryId}=req.query
    // const {_id}=req.authUser
//  4- check if category is already exist by using category id
    const category= await Category.findByIdAndDelete(categoryId)
    if(!category)return next({cause:404 , message:'Category not found'})

// delete related subcategories
    const subCategorycheck=await subCategory.deleteMany({categoryId})
    if(subCategorycheck.deletedCount <=0){
        console.log("there is no related subcategories");
    }

// delete related brands
const brandcheck=await brand.deleteMany({categoryId})
if(brandcheck.deletedCount <=0){
    console.log("there is no related brands");
}

// delete all images
await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}`)
await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}`)
res.status(200).json({success:true , message: "category deleted successfully"})

}



