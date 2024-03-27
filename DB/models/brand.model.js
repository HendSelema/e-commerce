import { Schema ,model} from "mongoose"

const brandSchema =new Schema({
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
    subCategoryId:{
        type:Schema.Types.ObjectId,
        ref:'SubCategory',
        required:true
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }
},
{
    timestamps:true 
})



export default model('Brand',brandSchema)
