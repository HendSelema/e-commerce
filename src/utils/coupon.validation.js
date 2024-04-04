import couponUserModel from "../../DB/models/coupon-user.model.js";
import couponModel from "../../DB/models/cupon.model.js";

 

 export async function applyCouponValidation(couponCode,userId){
    // coupon code check
    const coupon =await couponModel.findOne({couponCode})
    if(!coupon) return {msg:'CouponCode is invalid',status:400}

    // coupon status check
    if(  DateTime.fromISO(coupon.toDate)<DateTime.now() ||
        coupon.couponStatus =='expired'
        )
         return {msg:'this coupon is expired',status:400}

    //  start date check
    if(DateTime.now() < DateTime.fromISO(coupon.toDate)) return {msg:'this coupon is not started yet',status:400}

    // user cases
    const isUserAssigned = await couponUserModel.findOne({couponId:coupon._id,userId})
    if(!isUserAssigned) return {msg:'this coupon is not assigned for you',status:400}

    // max usage check
    if(isUserAssigned.maxUsage <= isUserAssigned.usageCount) return {msg:'you have exceed the usage count for this coupon ',status:400}

return coupon

 }