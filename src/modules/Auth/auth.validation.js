
import Joi from 'joi'
// joi 

export const signUpSchema={
    body:Joi.object({
        username:Joi.string().required(),
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','eg'] } }).required(),
        password:Joi.string().required().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/)).required(),
        phoneNumbers:Joi.string().regex(/^01[0125][0-9]{8}$/).required(),
        age:Joi.number().required(),
        role:Joi.string().valid("user", "admin","superAdmin"),
        addresses:Joi.string(),
        }) 
}

export const verifyEmailSchema={
     query:Joi.object({
        token:Joi.string().required()
     })   
}


export const signinSchema={
    body:Joi.object({
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','eg'] } }).required(),
        password:Joi.string().required().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/)).required()
     })
}
