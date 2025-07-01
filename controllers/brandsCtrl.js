import asyncHandler from 'express-async-handler'
import Brand from '../models/Brand.js'
//@desc create brand
//@route POST api/v1/brands
//@access private/admin 
export const createBrandCtrl = asyncHandler(async(req ,res)=>{
    const{name} = req.body
    //check if the category already exists
    const brandFound = await Brand.findOne({name})

    if(brandFound){
        throw new Error('Brand already exists')
    }
    const brand = await Brand.create({
        name,
        user: req.userAuthId
    })
    res.json({
        msg : "brand created successfully",
        brand
    })
})

//@desc get all brands
//@route GET api/v1/brands
//@access public 

export const getAllBrandsCtrl = asyncHandler(async(req,res)=>{
    const brands = await Brand.find()
    res.json({
        status: "success",
        msg : "Brands fetched successfully",
        brands
    })
})

//@desc get single brand
//@route GET api/v1/brands/:id
//@access public

export const getBrandByIdCtrl = asyncHandler(async(req,res)=>{
    const brand = await Brand.findById(req.params.id)
    if(!brand){
        throw new Error('No brand found')
    }
    res.json({
        status : "success",
        msg : "brand fetched successfully",
        brand
    })
})

//@desc update a brand
//@route PUT api/v1/brand/:id
//@access private/admin

export const updateBrandCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body
    const brand = await Brand.findByIdAndUpdate(req.params.id, {name},{new : true})
    res.json({
        status : "success",
        msg : "brand updated successfully",
        brand
    })
})

//@desc delete a category
//@route DELETE api/v1/categories/:id
//@access private/admin

export const deleteBrandCtrl = asyncHandler(async(req,res)=>{
    await Brand.findByIdAndDelete(req.params.id)
    res.json({
        status: "success",
        msg : "Brand deleted successfully"
    })
})