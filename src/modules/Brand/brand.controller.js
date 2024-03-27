import brand from ".././../../DB/models/brand.model.js"
import subCategory from "../../../DB/models/sub-category.model.js"
import slugify from "slugify"
import cloudinaryConnection from "../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import { systemRoles } from "../../utils/system-roles.js"
import Category from "../../../DB/models/category.model.js"
import Product from "../../../DB/models/product.model.js"
import { APIFeatures } from "../../utils/api-features.js"
// ....................... add brand.............
export const addBrand =async(req,res,next)=>{
    // 1- destruct the required data from the request object
    const {name}=req.body
    const {categoryId,subCategoryId}=req.query
    const {_id}=req.authUser

    // 2- subCategory check 
    const subCategoryCheck=await subCategory.findById(subCategoryId).populate("categoryId","folderId")
    if(!subCategoryCheck) return next({message:"subCategory not found", cause:404})
    console.log(subCategoryCheck);
    // 3-check if name of brand for specific subCategory is exist or not
    const isBrandExists = await brand.findOne({name , subCategoryId})
    if(isBrandExists) return next({message:"Brand already exist for this subCategory",cause:400})
    
    // 4-category check
    console.log(categoryId,
        subCategoryCheck.categoryId._id );
    if(categoryId != subCategoryCheck.categoryId._id) return next({message:"Category not found",cause:404})

    // 5-generate the slug
    const slug = slugify(name,"-")

    // 6- upload brand logo
    if(!req.file) return next({message:"please upload the brand logo",cause:400})
    const folderId =nanoid(4)
    const {secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER}/Categories/${subCategoryCheck.categoryId.folderId}/SubCategories/${subCategoryCheck.folderId}/Brands/${folderId}`
    })

    const brandObject={
        name,slug,
        Image:{secure_url,public_id},
        folderId,
        addedBy:_id,
        subCategoryId,
        categoryId
    }

    const newBrand = await brand.create(brandObject)

    res.status(201).json({
        status:"success",
        message:"brand added successfully",
        data:newBrand
    })

}

//......................... update brand.............
export const updateBrand=async(req,res,next)=>{
    // superadmin
    // admin
    const {_id}=req.authUser
    // data
    const {name,oldPublicId}=req.body
    // productid
    const {brandId}=req.params
    // product check
    const Brand= await brand.findById(brandId)
    if(!Brand)return next({message:"brand not found"})

    // auth check
  if(
    req.authUser.role !== systemRoles.SUPER_ADMIN && 
    Brand.addedBy.toString() !==_id.toString()
    ) 
     return next({message:"you are not allowed to update brand"})

// name
if (name){
    if(name == Brand.name){
        return next({cause:409 ,message:"please enter differnet brand name from the existing one"})
}
    Brand.name = name
    const slug =slugify(name,{lower:true,replacement:"-"})
    Brand.slug=slug
} 

// images
// check if user want to update Image (oldPublicId) 
if(oldPublicId){

    if(!req.file)return next({cause:400 , message:"image is required"})
    
    const newPublicId = oldPublicId.split(`${Brand.folderId}/`)[1]
    console.log(newPublicId)
    const { secure_url ,public_id }= await cloudinaryConnection().uploader.upload(req.file.path,{
         folder:`${oldPublicId.split(`${Brand.folderId}/`)[0]}${Brand.folderId}`,
        public_id: newPublicId
        })
        console.log(public_id);

        Brand.Image.secure_url= secure_url

}

// set value for updatedBy field
Brand.updatedBy = _id

const updatedBrand =await Brand.save()
res.status(200).json({success:true,message:"brand updated successfully",data:updatedBrand})
}

//......................... delete brand.............
export const deleteBrand =async(req,res,next)=>{
 
    const {brandId}=req.params
    // Brand check
    const Brand= await brand.findById(brandId)
    console.log(Brand);
    if(!Brand)return next({message:"brand not found"})
    const category =await Category.findById(Brand.categoryId)
    const subcategory =await subCategory.findById(Brand.subCategoryId)

// delete related products
const productcheck=await Product.deleteMany({brandId})
if(productcheck.deletedCount <=0){
   console.log(productcheck.deletedCount);
   console.log("there is no related products");
}
// delete all images
await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${subcategory.folderId}/Brands/${Brand.folderId}`)
await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${subcategory.folderId}/Brands/${Brand.folderId}`)
const BrandDeleted= await brand.findByIdAndDelete(brandId)
if(!BrandDeleted){
       res.json({success:false , message: "brand deleted failed"})}
res.status(200).json({success:true , message: "brand deleted successfully"})
}

//....................... get all brands for specific subcategory.............
export const brandsForSubcategory = async(req,res,next)=>{
    // id subcategory
    const {subCategoryId}=req.query
    // check subcategory
    const subcategory=await subCategory.findById(subCategoryId)
    if(!subcategory)return next({cause:404 , message:'this subcategory not found'})
    
    const brands= await brand.find({subCategoryId:subcategory._id})
        res.status(200).json({
            success:true ,
             message: "brands fetched successfully",
             data:brands
            })
}

//....................... get all brands for category .............
export const brandsForCategory = async(req,res,next)=>{
    // id category
    const {categoryId}=req.query
    // check subcategory
    const category=await Category.findById(categoryId)
    if(!category)return next({cause:404 , message:'this category not found'})
    
    const brands= await brand.find({categoryId:category._id})
        res.status(200).json({
            success:true ,
             message: "brands fetched successfully",
             data:brands
            })
}


// ...............apply the api featutres ................

export const getAllBrands = async(req,res,next)=>{
    const {page,size,sort, ...query}=req.query

    const features=new APIFeatures(req.query, brand.find())
    .pagination({ page,size })
    .sort(sort)
    // .search(query)
    .filter(query)
    const brands=await features.mongooseQuery
        res.status(200).json({success:true ,data:brands})

}
