import { Schema ,model} from "mongoose"

const couponSchema =new Schema({
   couponCode:{
    type:String,
    unique:true,
    lowercase:true,
    trim:true,
    required:true
   },
   couponAmount:{
    type:Number,
    required:true,
    min:1
   },
   couponStatus:{
    type:String,
    enum:["valid","expired"],
    default:"valid"
   },
   isFixed:{
    type:Boolean,
    default:false
   },
   isPercentage:{
    type:Boolean,
    default:false
   },
   fromDate:{
    type:String,
    required:true
   },
   toDate:{
    type:String,
    required:true
   },
   addedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   updatedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
   }

},
{
    timestamps:true 
})



export default model('Coupon',couponSchema)
