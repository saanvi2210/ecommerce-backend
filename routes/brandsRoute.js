import exppress from 'express'
import isLoggedIn from '../middlewares/isLoggedIn.js';
import { createBrandCtrl, deleteBrandCtrl, getAllBrandsCtrl, getBrandByIdCtrl, updateBrandCtrl } from '../controllers/brandsCtrl.js';
import { isAdmin } from '../middlewares/isAdmin.js';


const brandRoutes = exppress.Router()

brandRoutes.post("/addBrand", isLoggedIn,isAdmin, createBrandCtrl)
brandRoutes.get("/all", getAllBrandsCtrl)
brandRoutes.get("/:id", getBrandByIdCtrl)
brandRoutes.put("/update/:id", isLoggedIn, isAdmin, updateBrandCtrl)
brandRoutes.delete("/:id", isLoggedIn, isAdmin, deleteBrandCtrl)

export default brandRoutes