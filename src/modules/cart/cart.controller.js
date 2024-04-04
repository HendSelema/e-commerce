import Cart from "../../../DB/models/cart.model.js"
// import Product from "../../../DB/models/product.model.js"
import { checkProductAvailability } from "./utils/check-product-in-db.js"
import { getUserCart } from "./utils/get-user-cart.js"
import { addnewCart } from "./utils/add-cart.js"

// ...............add product to cart ............
export const addCart=async(req,res,next)=>{
    // destruct productId , quantity from body
    // destruct userId from authuser
    const {productId,quantity}=req.body
    const {_id}=req.authUser

    // 1. check if product exists and if it is available
    const product =await checkProductAvailability(productId,quantity)
    if(!product)return next({message:"product not found or not available",cause:404})

    // 2. check if loggedIn user has a cart
    const userCart=await getUserCart(_id)
    console.log(userCart);
    // 3.  if there no cart .. add cart to you DB and add the product to the cart
    if(!userCart){
      const newCart =await addnewCart(_id,product,quantity)
        return res.status(201).json({message:"product added to cart successfully",data:newCart})
    }

    // 4. if user has a cart ..
    // 5. check if product is already in the cart
    let isProductExist=false
    let supTotal=0
    for (const product of userCart.products) {  
        if(product.productId.toString() === productId){
            // update quantity and finalPrice
             product.quantity = quantity
             product.finalPrice=product.basePrice*quantity
            isProductExist = true
        }
    }
    // 6.  if product not exists.. add product to the cart
    if(!isProductExist){
        userCart.products.push({
                productId:productId,
                    quantity:quantity,
                    basePrice:product.appliedPrice,
                    finalPrice:product.appliedPrice * quantity,
                    title:product.title
                })

    }
    for (const product of userCart.products) {
        supTotal += product.finalPrice
    }
    userCart.supTotal=supTotal
    await userCart.save()
    res.status(201).json({message:"product added to cart successfully",data:userCart})


}

// ....................remove from cart.......
export const removeFromCart = async (req,res,next)=>{
        // destruct productId  from params
    // destruct userId from authuser
    const {productId}=req.params
    const {_id}=req.authUser
    // check if loggedIn user has a cart
    const userCart=await Cart.findOne({userId:_id , "products.productId":productId})
    if(!userCart)return next({message:"product not found",cause:404})

    // delete product from cart
    userCart.products=userCart.products.filter(product => product.productId.toString() !== productId)

    let supTotal=0
    for (const product of userCart.products) {
        supTotal += product.finalPrice
    }
    userCart.supTotal=supTotal
    const newCart=await userCart.save()
    if(newCart.products.length === 0){
        await Cart.findByIdAndDelete(newCart._id)
    }
    res.status(201).json({message:"product deleted from cart successfully"})


}

