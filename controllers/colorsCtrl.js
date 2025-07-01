import asyncHandler from 'express-async-handler'
import Color from '../models/Color.js'
//@desc create color
//@route POST api/v1/color
//@access private/admin 
export const createColorCtrl = asyncHandler(async(req ,res)=>{
    const{name} = req.body
    //check if the category already exists
    const colorFound = await Color.findOne({name})

    if(colorFound){
        throw new Error('Color already exists')
    }
    const color = await Color.create({
        name,
        user: req.userAuthId
    })
    res.json({
        msg : "color created successfully",
        color
    })
})

//@desc get all colors
//@route GET api/v1/colors
//@access public 

export const getAllColorsCtrl = asyncHandler(async(req,res)=>{
    const colors = await Color.find()
    res.json({
        status: "success",
        msg : "Colors fetched successfully",
        colors
    })
})

//@desc get single color
//@route GET api/v1/colors/:id
//@access public

export const getColorByIdCtrl = asyncHandler(async(req,res)=>{
    const color = await Color.findById(req.params.id)
    if(!color){
        throw new Error('No color found')
    }
    res.json({
        status : "success",
        msg : "color fetched successfully",
        color
    })
})

//@desc update a color
//@route PUT api/v1/color/:id
//@access private/admin

export const updateColorCtrl = asyncHandler(async(req,res)=>{
    const {name} = req.body
    const color = await Color.findByIdAndUpdate(req.params.id, {name},{new : true})
    res.json({
        status : "success",
        msg : "color updated successfully",
        color
    })
})

//@desc delete a color
//@route DELETE api/v1/color/:id
//@access private/admin

export const deleteColorCtrl = asyncHandler(async(req,res)=>{
    await Color.findByIdAndDelete(req.params.id)
    res.json({
        status: "success",
        msg : "Color deleted successfully"
    })
})