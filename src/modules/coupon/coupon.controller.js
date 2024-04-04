import couponModel from "../../../DB/models/cupon.model.js"
import couponUsers from "../../../DB/models/coupon-user.model.js"
import User from "../../../DB/models/user.model.js"
import { applyCouponValidation } from "../../utils/coupon.validation.js"
import { APIFeatures } from "../../utils/api-features.js"
import { systemRoles } from "../../utils/system-roles.js"



// .................add coupon API...............
export const addCoupon= async (req,res,next)=>{
    // destruct data from body
    const {couponCode,couponAmount,isFixed,isPercentage,fromDate,toDate,Users}=req.body
    const {_id:addedBy}= req.authUser
    // coupon code check
    const isCouponExist=await couponModel.findOne({couponCode})
    if(isCouponExist)return next({message:"coupon code already exist",cause:409})

    // check coupon isfixed or is percentage
    if(isFixed == isPercentage)return next({message:"coupon can be either isFixed or isPercentage",cause:400})

    // check coupon amount
    if(isPercentage){
        if(couponAmount > 100){
            return next({message:"percentage should be less than 100",cause:400})
        }
    }

    const couponObj={
        couponCode,couponAmount,isFixed,isPercentage,fromDate,toDate,addedBy
    }

    const coupon =await couponModel.create(couponObj)
    for (const user of Users) {
        const isUserExist = await User.findById(user.userId)
        if(!isUserExist)return next({message:"user not found",cause:404})
    }
    const couponusers =await couponUsers.create(
        Users.map(ele=>({...ele,couponId:coupon._id}))
    )
    res.status(201).json({message:"coupon created successfully",coupon,couponusers})
}


// .........validation.........

export const validateCouponApi = async(req,res,next)=>{
    const {code}=req.body
    const {_id:userId}=req.authUser
// apply coupon validation
const isCouponValid =await applyCouponValidation(code,userId)
if(isCouponValid.status){
    return next({message:isCouponValid.msg,cause:isCouponValid.status})
}
    res.json({message:"coupon is valid",coupon:isCouponValid})
}



// .....Apply the API features in Coupons...........
export const getAllCoupons = async(req,res,next)=>{
    const {page,size,sort, ...query}=req.query

    const features=new APIFeatures(req.query, couponModel.find())
    .pagination({ page,size })
    // .sort(sort)
    // .search(query)
    .filter(query)
    const coupons=await features.mongooseQuery
        res.status(200).json({success:true ,data:coupons})

}


// .................... get coupon by id ........
export const getCoupon = async(req,res,next)=>{
    // id coupon
    const {couponId}=req.params
    // check coupon
    const coupontExist=await couponModel.findById(couponId)
    if(!coupontExist)return next({cause:404 , message:'coupon not found'})

    res.status(200).json({success:true , message: "coupon fetched successfully",data:coupontExist})

}


// .................update coupon............
export const updateCoupon =async(req,res,next)=>{
    // 1-destructing the request body
    // 2-destructing the request query
    // 3-destructing the _id from the request authUser
    const {couponCode,couponAmount,fromDate,toDate}=req.body
    const {couponId}=req.query
    const {_id:updatedBy}= req.authUser
//  4- check if coupon is already exist by using coupon id
    const coupon= await couponModel.findById(couponId)
    if(!coupon)return next({cause:404 , message:'coupon not found'})

// auth check
  if(
    req.authUser.role !== systemRoles.SUPER_ADMIN &&
    coupon.addedBy.toString() !== updatedBy.toString()
    ) return next({message:"you are not allowed to update coupon"})

// check if you want to update name of coupon
if(couponCode){
    //  check if the new name is different from old name
    if(couponCode == coupon.couponCode){
            return next({cause:409 ,message:"please enter differnet coupon name from the existing one"})
    }
    //  check if the new name is already exist
    const isNameDublicated = await couponModel.findOne({couponCode}) 
    if(isNameDublicated){
        return next({cause:409 , message:"coupon name is already exist"})
    } 
}  

// check if you want to update coupon Amount
if (couponAmount) coupon.couponAmount=couponAmount

// check if you want to update fromDate
if (fromDate) coupon.fromDate=fromDate

// check if you want to update toDate
if (toDate) coupon.toDate=toDate

// set value for updatedBy field
coupon.updatedBy = updatedBy
await coupon.save()
res.status(200).json({success:true , message: "coupon updated successfully", data:coupon})
}


