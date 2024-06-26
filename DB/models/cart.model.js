import { Schema ,model} from "mongoose"

const cartSchema =new Schema({
   
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            },
            basePrice:{
                type:Number,
                required:true,
                default:0
            },
            finalPrice:{
                type:Number,
                required:true
            },
            title:{
                type:String,
                required:true
            },
        }
    ],
    supTotal:{
        type:Number,
        required:true,
        default:0
    }
},
{
    timestamps:true 
})



export default model('Cart',cartSchema)
