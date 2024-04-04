
import Joi from 'joi'
// joi 

export const addSchema={
    body:Joi.object({
        name:Joi.string().required()
        }) 
}

export const updateSchema={
    body:Joi.object({
        name:Joi.string().required(),
        oldPublicId:Joi.string().required()
        }) ,
     query:Joi.object({
        categoryId:Joi.string().required()
     })   
}

export const deleteSchema={
    query:Joi.object({
        categoryId:Joi.string().required()
     }) 
}

export const  getCategorySchema={
    params:Joi.object({
        categoryId:Joi.string().required()
        }) 
}


