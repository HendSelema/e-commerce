export const globalResponse =(err,req,res,next)=>{
    if(err){
        
        console.log(err);
         res.status(err['cause'] || 500).json({
            message:'Catch Error',
            error_msg:err.message,
            errorLocation:err.stack
        })
        next()
    }
}