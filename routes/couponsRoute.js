import exppress from 'express'
import isLoggedIn from '../middlewares/isLoggedIn.js';
import { createCouponCtrl, getAllCouponsCtrl,  updateCouponCtrl, deleteCouponCtrl, getCouponCtrl } from '../controllers/couponsCtrl.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const couponRoutes = exppress.Router()

couponRoutes.post("/add", isLoggedIn, isAdmin, createCouponCtrl)
couponRoutes.get("/all", getAllCouponsCtrl)
couponRoutes.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl);
couponRoutes.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl);
couponRoutes.get("/single", getCouponCtrl);

export default couponRoutes
