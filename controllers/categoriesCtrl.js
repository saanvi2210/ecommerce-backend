import asyncHandler from 'express-async-handler'
import Category from '../models/Category.js'
//@desc create category
//@route POST api/v1/categories
//@access private/admin 
export const createCategoryCtrl = asyncHandler(async(req ,res)=>{
    const{name} = req.body
    //check if the category already exists
    const catFound = await Category.findOne({name})

    if(catFound){
        throw new Error('Category already exists')
    }
    const category = await Category.create({
        name,
        user: req.userAuthId
    })
    res.json({
        msg : "Category created successfully",
        category
    })
})

//@desc get all categories
//@route GET api/v1/categories
//@access public 

export const getAllCatCtrl = asyncHandler(async(req,res)=>{
    const categories = await Category.find()
    res.json({
        status: "success",
        msg : "Categories fetched successfully",
        categories
    })
})

//@desc get single category
//@route GET api/v1/categories/:id
//@access public

export const getCatByIdCtrl = asyncHandler(async(req,res)=>{
    const category = await Category.findById(req.params.id)
    if(!category){
        throw new Error('No category found')
    }
    res.json({
        status : "success",
        msg : "category fetched successfully",
        category
    })
})

//@desc update a category
//@route PUT api/v1/categories/:id
//@access private/admin

export const updateCategoryCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body
    const category = await Category.findByIdAndUpdate(req.params.id, {name},{new : true})
    res.json({
        status : "success",
        msg : "category updated successfully",
        category
    })
})

//@desc delete a category
//@route DELETE api/v1/categories/:id
//@access private/admin

export const deleteCategoryCtrl = asyncHandler(async(req,res)=>{
    await Category.findByIdAndDelete(req.params.id)
    res.json({
        status: "success",
        msg : "Category deleted successfully"
    })
})