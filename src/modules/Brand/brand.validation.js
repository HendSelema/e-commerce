import Joi from 'joi'
// joi 


export const addSchema={
    body:Joi.object({
        name:Joi.string().required()
        }) ,
        query:Joi.object({
            categoryId:Joi.string().required(),
            subCategoryId:Joi.string().required(),
        })
}

export const updateSchema={
    body:Joi.object({
        name:Joi.string().required(),
        oldPublicId:Joi.string().required(),
        }) ,
        params:Joi.object({
            brandId:Joi.string().required()
        })   
}

export const deleteSchema={
    params:Joi.object({
        brandId:Joi.string().required()
     }) 
}

export const  brandsForSubcategorySchema={
    params:Joi.object({
        subCategoryId:Joi.string().required()
        }) 
}