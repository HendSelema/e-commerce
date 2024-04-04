import { Schema ,model} from "mongoose"

const couponUserSchema =new Schema({
   couponId:{
    type:Schema.Types.ObjectId,
    ref:"Coupon",
    required:true
   },
   userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   maxUsage:{
    type:Number,
    required:true,
    min:1
   },
   usageCount:{
    type:Number,
    min:0
   }
},
{
    timestamps:true 
})



export default model('CouponUser',couponUserSchema)
