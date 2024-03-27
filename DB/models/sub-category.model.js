import { Schema ,model} from "mongoose"

const SubCategorySchema =new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    Image:{
     secure_url:{type:String, required:true},
     public_id:{type:String, required:true,unique:true}
    },
    folderId:{
        type:String, 
        required:true,
        unique:true
    },
    addedBy:{
        // superAdmin
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedBy:{
        // superAdmin
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }
},
{
    timestamps:true ,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})
// brand virtual populate
SubCategorySchema.virtual('Brands',
{
    ref:'Brand',
    localField:'_id',
    foreignField:'subCategoryId'
})
export default model('SubCategory',SubCategorySchema)
