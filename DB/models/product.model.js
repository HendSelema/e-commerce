import { Schema ,model} from "mongoose"


const productSchema =new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    desc:String,
    slug:{
        type:String,
        required:true,     
    },
    basePrice:{type:Number,required:true},    
    discount:{type:Number,default:0},    
    appliedPrice:{type:Number,required:true},    
    stock:{type:Number,required:true,min:0,default:0},    
    rate:{type:Number,min:0,default:0,max:5},    
  
    Images:[{
     secure_url:{type:String, required:true},
     public_id:{type:String, required:true,unique:true}
    }],
    folderId:{
        type:String, 
        required:true,
        unique:true
    },
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    brandId:{type:Schema.Types.ObjectId,ref:'Brand',required:true},
    subCategoryId:{type:Schema.Types.ObjectId,ref:'SubCategory',required:true},
    categoryId:{type:Schema.Types.ObjectId,ref:'Category',required:true},
   specs:{
    type:Map,
    of:[String | Number]
   }

},
{
    timestamps:true ,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
productSchema.virtual('Reviews',{
    ref:"Review",
    localField:'_id',
    foreignField:'productId'
})

export default model('Product',productSchema)
