import exppress from 'express'
import isLoggedIn from '../middlewares/isLoggedIn.js';
import { createColorCtrl, deleteColorCtrl, getAllColorsCtrl, getColorByIdCtrl, updateColorCtrl } from '../controllers/colorsCtrl.js';
import { isAdmin } from '../middlewares/isAdmin.js';


const colorRoutes = exppress.Router()

colorRoutes.post("/addColor", isLoggedIn, isAdmin, createColorCtrl)
colorRoutes.get("/all", getAllColorsCtrl)
colorRoutes.get("/:id", getColorByIdCtrl)
colorRoutes.put("/update/:id", isLoggedIn, isAdmin, updateColorCtrl)
colorRoutes.delete("/:id", isLoggedIn, isAdmin, deleteColorCtrl)

export default colorRoutes