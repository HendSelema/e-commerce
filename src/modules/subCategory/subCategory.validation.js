import Joi from 'joi'
// joi 

export const addSchema={
    body:Joi.object({
        name:Joi.string().required()
        }) ,
        query:Joi.object({
            categoryId:Joi.string().required()
        })
}

export const updateSchema={
    body:Joi.object({
        name:Joi.string().required(),
        oldPublicId:Joi.string().required()
        }) ,
     query:Joi.object({
        subcategoryId:Joi.string().required()
     })   
}

export const deleteSchema={
    params:Joi.object({
        subCategoryId:Joi.string().required()
     }) 
}

export const getsubSchema={
    params:Joi.object({
        subCategoryId:Joi.string().required()
     }) 
}

export const subForCatSchema={
    query:Joi.object({
        categoryId:Joi.string().required()
     }) 
}

