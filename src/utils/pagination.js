export const paginationFunction =({ page=1 , size=2 })=>{
    // the required params
    if(page<1) page =1
    if(size<1) size =2

    // equations 
    // to convert string to int (+)
    const limit = +size
    const skip= (+page - 1)*limit
    return(limit,skip)
}