import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js';
import getTokenFromHeader from '../utils/getTokenFromHead.js';
import verifyToken from '../utils/verifyToken.js';

// @desc register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUserCtrl = asyncHandler(async(req, res)=>{
    const {fullname, email, password} = req.body;
    const userExists = await User.findOne({email})
    if (userExists){
        throw new Error('User already exists')
    }

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    //create the user
    const user = await User.create({fullname, email, password: hashed})
    res.status(201).json({
        status: "success",
        msg: "user registered successfully",
        data: user
    });
})

// @desc login user
// @route POST /api/v1/users/login
// @access Public

export const loginUserCtrl = asyncHandler(async(req, res)=>{
    const {email, password} = req.body
    const userFound = await User.findOne({email})
    //decrypt the password and compare it then pass the login
    if (userFound && await bcrypt.compare(password, userFound?.password)){
        res.json({
        msg : "user logged in successfully",
        userFound,
        token : generateToken(userFound?._id)
    })
    }else if (userFound){
        throw new Error('invalid password')
    }else{
        throw new Error('user not found')
    }
    
})

// @desc get user profile
// @route POST /api/v1/users/profile
// @access Private

export const getUserProfileCtrl = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.userAuthId).populate('orders')
    if (!user){
        throw new Error('User not found')
    }
    res.json({
        msg : "welocome to profile page",
        user
    })
})

export const updateUserAddressCtrl = asyncHandler(async(req,res)=>{
    const {firstname, lastname, address,city, postalCode,province, country, phone} = req.body
    const user = await User.findByIdAndUpdate(req.userAuthId, {
        hasShippingAddress : true,
        shippingAddress : {
            firstname, lastname, address,city, postalCode,province, country, phone
        },
    },{new : true})
    res.json({
        message: "Address updated successfully",
        user
    })
})