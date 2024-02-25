import mongoose from "mongoose"

const db_connection=async()=>{
    await mongoose.connect(process.env.CONNECTION_URL_LOCAL)
    .then((res)=>console.log("db_connection success"))
    .catch((err)=>console.log("db_connection success",err))
}


export default db_connection


