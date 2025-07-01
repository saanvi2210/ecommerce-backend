import exppress from 'express'
import isLoggedIn from '../middlewares/isLoggedIn.js';
import { createReviewCtrl } from '../controllers/reviewsCtrl.js';

const reviewRoutes = exppress.Router()
reviewRoutes.post("/add/:productID", isLoggedIn, createReviewCtrl)
export default reviewRoutes