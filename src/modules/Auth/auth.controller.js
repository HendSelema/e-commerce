import User from "../../../DB/models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmailService from "../services/send-email.service.js"

// ...............signup.................
export const signUp = async(req,res,next)=>{
    // destruct the required data from the request body
    const {username,email,password,phoneNumbers,age,role,addresses}=req.body
    // check  if the user already exists in the database using the email
    const isEmailDuplicated = await User.findOne({ email })
    if(isEmailDuplicated){
        // return res.sendApiError({
        //     title:'Email already exists',
        //     message:'please try another email'
        // })
        return next(new Error('Email already exists,please try another email',{cause:409}))
    }

    // send confirmation email to the user
    const userToken=jwt.sign({email},process.env.JWT_SECRET_VERFICATION,{expiresIn:'2w'})

    const isEmailSent=await sendEmailService(
        email,
        'Email Verfication',
        `<h2>please click here to verify your email</h2>
        <a href="http://localhost:3000/auth/verify-email?token=${userToken}">Verify Email</a>
        `
    )
    if (!isEmailSent){
        return next(new Error('Email  is not sent,please try again later', {cause:500}))
    }    

    // if Email not Duplicated 
    // hash password
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    // create new document in the database
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        phoneNumbers,
        age,
        role,
        addresses
    }) 
    // return the response
    res.status(201).json({
        success:true,
        message:'User Created Successfully',
        data:newUser
    })
} 


export const verifyEmail=async (req,res,next)=>{
    const {token}=req.query
    const decodedData= jwt.verify(token,process.env.JWT_SECRET_VERFICATION)
    // get user by email ,isEmailVerified = false
    const user = await User.findOneAndUpdate({email:decodedData.email , isEmailVerified: false},{isEmailVerified:true},{new:true})
    if(!user){
        return next(new Error('User not found',{cause:404}))
    }

    res.status(200).json({
        success:true,
        message:"Email verified successfully,please try to login",
        data:user
    })

}

// ....................signin...............

export const signin = async (req,res,next)=>{
    const {email ,password}=req.body
    // get user by email
    const user=await User.findOne({email,isEmailVerified:true})

    if(!user){
        return next(new Error('Invalid Login Credentails',{cause:404}))
    }
    // check password 
    const isPasswordValid = bcrypt.compareSync(password ,user.password)
    if(!isPasswordValid){
        return next(new Error('Invalid Login passwrd'))
    }

    // generate login token
    const token =jwt.sign({email, id:user._id ,loggedIn:true},process.env.JWT_SECRET_LOGIN,{expiresIn:"2w"})    
    // console.log(process.env.TOKEN_SIGNATURE);
    // update isLoggedIn = true in database
    user.isLoggedIn =true
    await user.save()

    res.status(200).json({
        success:true,
        message:'User Logged in successfully',
        data:{token}

    })

}

