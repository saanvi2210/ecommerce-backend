const getTokenFromHeader= (req) =>{
    const token = req?.headers?.authorization?.split(" ")[1]
    if (token === undefined){
        return undefined
    }else{
        return token
    }
}
export default getTokenFromHeader