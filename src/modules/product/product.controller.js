import slugify from "slugify"
import Brand from "../../../DB/models/brand.model.js"
import { systemRoles } from "../../utils/system-roles.js"
import cloudinaryConnection from "./../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import Product from "../../../DB/models/product.model.js"
import Category from "../../../DB/models/category.model.js"
import SubCategory from "../../../DB/models/sub-category.model.js"
import { APIFeatures } from "../../utils/api-features.js"


// .....................add product ...........
export const addProduct=async (req,res,next)=>{
    // data
    const {title,desc,basePrice,discount,stock,specs}=req.body
    const {brandId,subCategoryId,categoryId}=req.query
    const addedBy=req.authUser._id
    // checks
    // brandCheck
    const brand=await Brand.findById(brandId)
    if(!brand) return next({message:"Brand not found"})
    if(brand.categoryId.toString() !==categoryId) return next({message:"category not found"})
    if(brand.subCategoryId.toString() !==subCategoryId) return next({message:"subCategory not found"})
    if(
        req.authUser.role !== systemRoles.SUPER_ADMIN &&
        brand.addedBy.toString() !==addedBy.toString()
        ) return next({message:"you are not allowed to add product"})

// generate the slug
const slug =slugify(title,{lower:true ,replacement:'-'})
// discount
    const appliedPrice= basePrice -(basePrice * ((discount || 0) / 100))

// image
if(!req.files?.length)return next({message:"image is required"})
const folderId=nanoid(4)
let Images=[]   
 const folder =brand.Image.public_id.split(`${brand.folderId}/`)[0]

for (const file of req.files) {
    
    const {secure_url,public_id}=await cloudinaryConnection().uploader.upload(file.path,{
        folder:folder + `${brand.folderId}` +`/Products/${folderId}`
    })
    Images.push({secure_url,public_id})
}
console.log(specs);
    req.folder=folder + `${brand.folderId}` +`/Products/${folderId}`
    const product={title, desc, slug, basePrice, discount, appliedPrice, stock, specs: JSON.parse(specs), categoryId, subCategoryId, brandId, addedBy, Images, folderId}
    const newProduct =await Product.create(product)
    req.savedDocument={model:Product , _id:newProduct._id}
    res.status(201).json({success:true,message:"product created successfully",data:newProduct})
}

// ....................update product..................
export const updateProduct=async(req,res,next)=>{
    // superadmin
    // admin
    const {_id}=req.authUser
    // data
    const {title, desc, basePrice, discount, stock, specs, oldPublicId, Images}=req.body
    // productid
    const {productId}=req.params
    // product check
    const product= await Product.findById(productId)
    if(!product)return next({message:"product not found"})

    // auth check
  if(
        req.authUser.role !== systemRoles.SUPER_ADMIN &&
        product.addedBy.toString() !==_id.toString()
        ) return next({message:"you are not allowed to update product"})

// title
if (title){
    product.title = title
    const slug =slugify(title,{lower:true,replacement:"-"})
    product.slug=slug
} 

// desc
if (desc) product.desc=desc
// stock
if (stock) product.stock=stock
// specs
if (specs) product.specs=JSON.parse(specs)

// prices check
// basePrice, discount ,appliedPrice
const appliedPrice =(basePrice || product.basePrice)-((basePrice || product.basePrice) * ((discount || product.discount) / 100))
 product.appliedPrice=appliedPrice

 if (discount) product.discount=discount
 if (basePrice) product.basePrice=basePrice

// images
// check if user want to update Image (oldPublicId) 
if(oldPublicId){

    if(!req.file)return next({cause:400 , message:"image is required"})
    
    const newPublicId = oldPublicId.split(`${product.folderId}/`)[1]
    console.log(newPublicId)
    const { secure_url ,public_id }= await cloudinaryConnection().uploader.upload(req.file.path,{
         folder:`${oldPublicId.split(`${product.folderId}/`)[0]}${product.folderId}`,
        public_id: newPublicId
        })
        console.log(public_id);
        product.Images.map(img=>{
            if(img.public_id === oldPublicId) img.secure_url=secure_url

        })
}

const updatedProduct =await product.save()
res.status(200).json({success:true,message:"product updated successfully",data:updatedProduct})
}

// .............delete product...................
export const deleteProduct =async(req,res,next)=>{
 
    const {productId}=req.params
    // product check
    const product= await Product.findById(productId)
        if(!product)return next({message:"product not found"})
    console.log(product);
    const category= await Category.findById(product.categoryId)
    const subcategory= await SubCategory.findById(product.subCategoryId)
    const brand= await Brand.findById(product.brandId)
// delete all images
await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${subcategory.folderId}/Brands/${brand.folderId}/Products/${product.folderId}`)
    
await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${subcategory.folderId}/Brands/${brand.folderId}/Products/${product.folderId}`)

const productDeleted= await Product.findByIdAndDelete(productId)
if(!productDeleted){
    res.json({success:false , message: "product deleted failed"})}
    res.status(200).json({success:true , message: "product deleted successfully"})

}

// .................... get product by id ........
export const getProduct = async(req,res,next)=>{
    // id product
    const {productId}=req.params
    // check product
    const productExist=await Product.findById(productId).populate(
            [{path:'brandId' ,select:'name'} ,{path:'subCategoryId',select:'name'},{path:'categoryId' ,select:'name'},{path:'Reviews'}])
    if(!productExist)return next({cause:404 , message:'product not found'})

    res.status(200).json({success:true , message: "product fetched successfully",data:productExist})

}

// .................... get all products ...features.....
export const getAllProducts = async(req,res,next)=>{
    const {page,size,sort, ...query}=req.query

    const features=new APIFeatures(req.query, Product.find())
    .pagination({ page,size })
    // .sort(sort)
    // .search(query)
    .filter(query)
    const products=await features.mongooseQuery
        res.status(200).json({success:true ,data:products})

}
