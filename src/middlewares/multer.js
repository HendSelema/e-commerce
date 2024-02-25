import multer from "multer"
import { allowedExtensions } from "../utils/allowedExtensions.js"
// import generateUniqeString from "../utils/generate-Unique-string.js"

// multer middle host
export const multerMiddleHost=(
    {
        extensions=allowedExtensions.image
    }
)=>{
    // diskstorage
    const storage =multer.diskStorage({
        // filename:(req,file,cb)=>{
        //     const uniqueFileName = generateUniqeString(4)+'_' +file.originalname
        //     cb(null,uniqueFileName) 
        // }
    })

    // file filter
    const fileFilter=(req,file,cb)=>{
   
        if(extensions.includes(file.mimetype.split('/')[1])){
            return cb(null,true)
        }
            cb(new Error('Image format is not allowed!'),false)
    }
    const file = multer({fileFilter , storage})
    return file
}




