import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import Review from '../models/Review.js'

export const createReviewCtrl = asyncHandler(async(req, res)=>{
    const productID = req.params.productID
    const product = await Product.findById(productID).populate("reviews")
    if (!product){
        throw new Error('No product found')
    }
    // check if the user has already reviewed the product
    const hasReviewed = product?.reviews?.find((review)=>{
        return review?.user?.toString() === req.userAuthId.toString()
    })
    if(hasReviewed){
        throw new Error('You have already reviewed the product, Thanks!')
    }
    const {message, rating} = req.body
    const review = await Review.create({
        user : req.userAuthId,
        product : productID,
        message,
        rating
    })

    product.reviews.push(review._id)
    await product.save()
    res.json({
        status : "success",
        message : "review added successfully",
        review
    })

})