
import Joi from 'joi'
// joi 

export const updateSchema={
    body:Joi.object({
        username:Joi.string().required(),
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','eg'] } }).required(),
        age:Joi.number().required(),
        }) 
}


