
import Joi from 'joi'
// joi 

export const addSchema={
    body:Joi.object({
        name:Joi.string().required()
        // jobLocation:Joi.string().required().valid('onsite','remotely','hybrid'),
        // workingTime:Joi.string().required().valid('part_time','full_time'),
        // seniorityLevel:Joi.string().valid('Junior','Mid-Level','Senior','Team-lead','CTO'),
        // jobDescription:Joi.string().required(),
        // technicalSkills:Joi.array().required(),
        // softSkills:Joi.array(),
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


