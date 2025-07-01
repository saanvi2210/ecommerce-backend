import getTokenFromHeader from "../utils/getTokenFromHead.js"
import verifyToken from "../utils/verifyToken.js"

//pass this middleware before getting the user profile in the user profile route

const isLoggedIn = (req, res, next)=>{
    //get token from header
    const token = getTokenFromHeader(req)
    if(token === undefined){
        throw new Error('Please login')
    }
    //verify the token
    const decodedUser = verifyToken(token)
    //save the user into req object
    if (!decodedUser){
        throw new Error('Invalid/expired token, please login again')
    }else{
        req.userAuthId = decodedUser?.id;
        next();
    }
}
export default isLoggedIn