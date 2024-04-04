import Cart from "../../../../DB/models/cart.model.js"


export  async function addnewCart(userId,product,quantity) {
    const cartObj={
        userId,
        products:[
            {productId:product._id,
                quantity:quantity,
                basePrice:product.appliedPrice,
                finalPrice:product.appliedPrice * quantity,
                title:product.title
            }
        ],
        supTotal:product.appliedPrice * quantity
    }
    const newCart=await Cart.create(cartObj)
    return newCart
}