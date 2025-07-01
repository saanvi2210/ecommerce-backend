import asyncHandler from 'express-async-handler'
import Coupon from '../models/Coupon.js'

// create a coupon
// access /private
//POST api/v1/coupons/add

export const createCouponCtrl = asyncHandler(async(req,res)=>{
    const {code, startDate, endDate, discount} = req.body
    //check if the user is an admin
    //check if the code already exists
    const couponExists = await Coupon.findOne({code})
    if(couponExists){
        throw new Error('Coupon alreday exists')
    }
    const coupon = await Coupon.create({
        code : code?.toUpperCase(),
        startDate,
        endDate,
        discount,
        user : req.userAuthId
    })
    res.json({
        status : "success",
        msg : "coupon created successfully",
        coupon
    })


})

//get all coupons
// access/public
//GET api/v1/coupons/

export const getAllCouponsCtrl = asyncHandler(async(req,res)=>{
    const coupons = await Coupon.find()
    res.json({
        status: "success",
        msg : "Coupons fetched successfully",
        coupons
    })
})

export const getCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.query.code });
  //check if is not found
  if (coupon === null) {
    throw new Error("Coupon not found");
  }
  //check if expired
  if (coupon.isExpired) {
    throw new Error("Coupon Expired");
  }
  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});

export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

export const deleteCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Coupon deleted successfully",
    coupon,
  });
});