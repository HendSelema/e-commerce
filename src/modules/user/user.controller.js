
import { nanoid } from "nanoid"
import User from "../../../DB/models/user.model.js"
import bcrypt from 'bcryptjs'


// ..............update user ...........
export const updateUser=async(req,res,next)=>{
    const {username,email,age}=req.body
    const {_id} = req.authUser
    if(email){
        const isEmailExists = await User.findOne({ email })
        if(isEmailExists) return next(new Error('email is already exist'))

    }
    const updatedUser =await User.findByIdAndUpdate(_id,{username,email,age},{new:true})
if(!updateUser){
    return next(new Error('update fail'))
}
res.status(200).json({message:"done",data:updateUser})

}

// .................delete user ......
export const deleteUser=async(req,res,next)=>{
    const {_id} = req.authUser
   
    const deletedUser =await User.findByIdAndDelete(_id)
if(!deletedUser){
    return next(new Error('delete fail'))
}
res.status(200).json({message:"done"})

}

// .............get user profile data.....
export const getUserData = async(req,res,next)=>{
    const {_id}=req.authUser
    const user=await User.findById(_id)
    if(!user){
        return res.json({message:"invalid userId",status:400})
    }
    return res.json({message:"Done",status:200,user})

}

// ............forget password..............
export const forgetPassword=async(req,res,next)=>{
    const code =nanoid()
    await User.updateOne({email:req.body.email},{code})
    return res.json(code)
}

export const resetPassword=async(req,res,next)=>{
    const userExist =await User.find({email:req.body.email,code:req.body.code})
    if(!userExist){
            return next(new Error('user doesnt exist'))
    }
    const password=bcrypt.hashSync(req.body.password,+process.env.SALT_ROUNDS)
    await User.updateOne({email},{password})
    return res.status(200).json({message:"password successfully reset"})

}

// ............update password..................
   // send password to body
    // check if this pass already exist
    export const updatePassword=async (req,res,next)=>{

           const {password}=req.body
           const {_id}=req.authUser
       
           const isPasswordExist = await User.findOne({password})
           if (isPasswordExist){return res.json("password already exist")}
        
           const updatedPassword= await User.findOneAndUpdate(_id,{password},{new:true})
       
           if(!updatedPassword) return res.json({message:"ubdated failed"})
           return res.json({message:"done",updatedPassword})
     
       }

// ............refresh token concept............



