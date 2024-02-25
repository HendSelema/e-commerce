
import jwt from "jsonwebtoken";
import User from "../../DB/models/user.model.js";

// export const auth = ()=>{
//     return async (req,res,next) => {
//        try {
//         const { accessToken } = req.query

//         // console.log(accessToken);
//          if (!accessToken) return next(new Error('please login first', { cause: 400 }))

//         // if(!accessToken) return res.json ({message:'please login first',status:4000})
//         // if(!accessToken.startsWith(process.env.TOKEN_PREFIX)) return res.json ({message:'invalid prefix',status:4000})
//         // const token =accessToken.split(process.env.TOKEN_PREFIX)[1]
//         // console.log(token); 

//         // console.log(process.env.TOKEN_SIGNATURE);

//         const decodedData=jwt.verify(accessToken,"accessTokenSignature")
//         // console.log(process.env.TOKEN_SIGNATURE);

//         console.log(decodedData);
//     if(!decodedData || !decodedData.id) res.json({message:"invalid token payload"})
// // usercheck
//     const findUser = await User.findById(decodedData.id ,'username email role')
//     if(!findUser) res.json({message:"please signup first"})
// // authorization check

// // if(!accessRoles.includes(findUser.role))return res.status(401).json({message:"you are not allowed to access this route"})

//     req.authUser = findUser
//     next()
//     // console.log(findUser)

//        } catch (error) {
//         res.json({message:"catch error in auth middleware",error})
//        }
//     }
// }


// import jwt from 'jsonwebtoken'
// import User from "../../DB/models/user.model.js";

export const auth = (accessRoles) => {
    return async (req, res, next) => {
        try {
            const { accesstoken } = req.query
            if (!accesstoken) return next(new Error('please login first', { cause: 400 }))

            // if (!accesstoken.startsWith(process.env.TOKEN_PREFIX)) return next(new Error('invalid token prefix', { cause: 400 }))

            // const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]

            const decodedData = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN)

            if (!decodedData || !decodedData.id) return next(new Error('invalid token payload', { cause: 400 }))

            // user check 
            const findUser = await User.findById(decodedData.id, 'username email role') // loggdInUser ROle
            if (!findUser) return next(new Error('please signUp first', { cause: 404 }))
            // auhtorization
            if (!accessRoles.includes(findUser.role)) return next(new Error('unauthorized', { cause: 401 }))
            req.authUser = findUser
            next()
        } catch (error) {
                    res.json({message:"catch error in auth middleware",error})
        }
    }
}
