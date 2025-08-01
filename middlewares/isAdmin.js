import User from '../models/User.js'
export const isAdmin = async(req, res, next)=>{
    const user = await User.findById(req.userAuthId)
    if(user.isAdmin){
        next()
    }else{
        next(new Error('Access denied'))
    }
}