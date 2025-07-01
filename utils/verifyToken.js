import jwt from 'jsonwebtoken'

const verifyToken = (token) =>{
    return jwt.verify(token, "fgvd567", (err, decoded)=>{
        if (err){
            return undefined
        }else{
            return decoded
        }
    })
}
export default verifyToken