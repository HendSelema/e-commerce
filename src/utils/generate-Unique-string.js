import { customAlphabet } from "nanoid";

const generateUniqeString =(length)=>{
    const nanoid =customAlphabet('dfgh1234',length || 10)
    return nanoid

}

export default generateUniqeString



