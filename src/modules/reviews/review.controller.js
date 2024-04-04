import orderModel from "../../../DB/models/order.model.js";
import reviewsModel from "../../../DB/models/reviews.model.js";
import productModel from "../../../DB/models/product.model.js";

// ............... add review ............

export const addReview=async(req,res,next)=>{
    const userId=req.authUser._id
    const {productId}=req.query
    const  {reviewRate , reviewComment} =req.body

// check product 
const isProductValidToBeReviewed =await orderModel.findOne({
    userId,
    'products.productId':productId,
    orderStatus:'Delivered'
})
if(!isProductValidToBeReviewed) return next(new Error('you should buy the product first'))


const reviewObj={ productId, userId, reviewRate , reviewComment}

const reviewDB= await reviewsModel.create(reviewObj)

if(!reviewDB){
    return next(new Error('fail to add review',{cause:500}))
}
const product = await productModel.findById(productId)
const reviews = await reviewsModel.find({productId})

let sumOfRates=0
for (const review of reviews) {
    sumOfRates += review.reviewRate
}
product.rate=Number(sumOfRates/reviews.length).toFixed(2)
await product.save()
res.status(201).json({message:"Done",reviewDB,product})

}

