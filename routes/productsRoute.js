import exppress from 'express'
import isLoggedIn from '../middlewares/isLoggedIn.js';

import { createProductCtrl, deleteProductCtrl, getProductByIdCtrl, getProductsCtrl, updateProductCtrl } from '../controllers/productsCtrl.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const productRoutes = exppress.Router();
productRoutes.post("/addProduct", isLoggedIn, isAdmin, createProductCtrl)
productRoutes.get("/getProducts", getProductsCtrl)
productRoutes.get("/getProduct/:id", getProductByIdCtrl)
productRoutes.put("/update/:id",isLoggedIn, isAdmin, updateProductCtrl)
productRoutes.delete("/delete/:id",isLoggedIn, isAdmin, deleteProductCtrl)


export default productRoutes;