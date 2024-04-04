import Joi from "joi"



export const addReviewSchema={
    body:Joi.object({
        reviewRate:Joi.number().min(1).max(5).required(),
        reviewComment:Joi.string().min(5).max(500).optional()
    }),
    query:Joi.object({
        productId:Joi.string().required()
    })
}