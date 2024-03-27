import Joi from 'joi'
// joi 


export const addSchema={
    body:Joi.object({
        title:Joi.string().required(),
        basePrice:Joi.number().required(),
        stock:Joi.number().required(),
        }) ,
        query:Joi.object({
           categoryId:Joi.string().required(),
           brandId:Joi.string().required(),
           subCategoryId:Joi.string().required()
        })
}

export const updateSchema={
    body:Joi.object({
        title:Joi.string().required(),
        basePrice:Joi.number().required(),
        stock:Joi.number().required(),
        oldPublicId:Joi.string().required(),
        }) ,
        params:Joi.object({
            productId:Joi.string().required()
        })   
}

export const deleteSchema={
    params:Joi.object({
        productId:Joi.string().required()
     }) 
}

export const  getProductSchema={
    params:Joi.object({
        productId:Joi.string().required()
        }) 
}