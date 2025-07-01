import exppress from 'express'
import isLoggedIn from '../middlewares/isLoggedIn.js'
import { createOrderCtrl, getOrderByIdCtrl, getOrdersCtrl, getSaleStatsCtrl, updateOrderCtrl } from '../controllers/ordersCtrl.js'

const orderRoutes = exppress.Router()
orderRoutes.post("/", isLoggedIn, createOrderCtrl)
orderRoutes.get("/all", isLoggedIn, getOrdersCtrl)
orderRoutes.get("/:id", isLoggedIn, getOrderByIdCtrl)
orderRoutes.put("/update/:id", isLoggedIn, updateOrderCtrl)
orderRoutes.get("/sales/stats", isLoggedIn, getSaleStatsCtrl)
export default orderRoutes