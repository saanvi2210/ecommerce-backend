import jwt from 'jsonwebtoken'
const generateToken = (id) => {
    return jwt.sign({id}, "fgvd567", {expiresIn: "3d"})
}
export default generateToken