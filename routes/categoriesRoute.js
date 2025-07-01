import exppress from 'express'
import isLoggedIn from '../middlewares/isLoggedIn.js';
import { createCategoryCtrl, deleteCategoryCtrl, getAllCatCtrl, getCatByIdCtrl, updateCategoryCtrl } from '../controllers/categoriesCtrl.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const categoryRoutes = exppress.Router()

categoryRoutes.post("/addCat", isLoggedIn, isAdmin, createCategoryCtrl)
categoryRoutes.get("/all", getAllCatCtrl)
categoryRoutes.get("/:id", getCatByIdCtrl)
categoryRoutes.put("/update/:id", isLoggedIn, isAdmin, updateCategoryCtrl)
categoryRoutes.delete("/:id", isLoggedIn, isAdmin, deleteCategoryCtrl)

export default categoryRoutes