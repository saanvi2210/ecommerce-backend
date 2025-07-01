import exppress from 'express'
import { getUserProfileCtrl, loginUserCtrl, registerUserCtrl, updateUserAddressCtrl } from '../controllers/usersCtrl.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const userRoutes = exppress.Router();
userRoutes.post("/register", registerUserCtrl)
userRoutes.post("/login", loginUserCtrl)
userRoutes.get("/profile",isLoggedIn, getUserProfileCtrl)
userRoutes.post("/addAddress",isLoggedIn, updateUserAddressCtrl)

export default userRoutes;