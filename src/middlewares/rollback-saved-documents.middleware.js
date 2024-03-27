

export const rollbackSavededDocuments=async (req,res,next)=>{
   console.log("rollbackSavededDocuments",req.savedDocument);
    if(req.savedDocument){
        const {model,_id}=req.savedDocument
        await model.findByIdAndDelete(_id)
    }
    

}
