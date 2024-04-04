import cartModel from "../../../../DB/models/cart.model.js"


export  async function getUserCart(userId) {
    const userCart =await cartModel.findOne({userId})

    return userCart
}