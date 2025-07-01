import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Stripe from 'stripe'
import dotenv from "dotenv"
import Coupon from '../models/Coupon.js'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_KEY);

//this will be triggered when the user clicks on place order and proceeds to payment then we will add the order in the database
export const createOrderCtrl = asyncHandler(async(req, res)=>{
    //get the coupon
    const {coupon} = req.query
    const couponFound = await Coupon.findOne({code : coupon?.toUpperCase()})
    if(couponFound.isExpired){
        throw new Error('The coupon i expired')
    }
    const discount = couponFound.discount/100
    // get the payload( customer, orderItems, shipping address, totalPrice)
    const {orderItems,totalPrice} = req.body
    // find the user
    const user = await User.findById(req.userAuthId)
    // check if the user has a shipping address
    if(!user?.hasShippingAddress){
        throw new Error('Please add a shipping address')
    }
    // check if the order is not empty
    if(orderItems?.length <= 0){
        throw new Error('No items added')
    }
    //Place/create order - save to db
    const newOrder = await Order.create({
        user : user?._id,
        orderItems,
        shippingAddress :user?.shippingAddress,
        totalPrice : couponFound ? totalPrice -(totalPrice*discount) : totalPrice
    })
    // push the order to the user
    user?.orders.push(newOrder)
    await user.save()
    // update the product quantity
    orderItems.map(async (order)=>{
        const product = await Product.findById(order.productId)
        if(product){
            product.totalSold += parseInt(order.qty) 
            product.totalQty -= parseInt(order.qty)
        }
        await product.save()
    })
    //converting the orderItems to stripe format
    const convertedItems = orderItems.map((item)=>{
        return({
            price_data: {
                currency: "usd",
                product_data:{
                    name : item?.name,
                    description : item?.description
                },
                unit_amount: item?.price * 100
            },
            quantity : item?.qty

        })
    })
    // make payment (stripe)
    const session =  await stripe.checkout.sessions.create({
        line_items: convertedItems,
        mode: "payment",
        metadata: {
            orderId : JSON.stringify(newOrder?._id)
        },
        success_url : "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel"
    });
    res.send({
        status : "Success",
        msg : "Order created successfully",
        newOrder,
        url: session.url
    });
    // res.json({
    //     status : "success",
    //     msg : "Order created successfully",
    //     newOrder
    // })
    // payment webhook
    // update the user order
})

// get all orders
//access/private

export const getOrdersCtrl = asyncHandler(async(req,res)=>{
    const orders = await Order.find()
    res.json({
        status: "success",
        msg : "orders fetched successfully",
        orders
    })
})

//get order by id
//access /private

export const getOrderByIdCtrl = asyncHandler(async(req,res)=>{
    const id = req.params.id
    const order = await Order.findById(id)
    res.json({
        status: "success",
        msg : "order fetched successfully",
        order
    })
})

// update order status
//access/private
//api/v1/orders/update/:id

export const updateOrderCtrl = asyncHandler(async(req,res)=>{
    const id = req.params.id
    const order = await Order.findByIdAndUpdate(id, {
        status : req.body.status
    },
    {new:true}
)
    res.json({
        status : "success",
        msg : "order updated successfully",
        order
    })
})


//get the sum of all orders
// GET api/v1/orders/sales/stats
// access private/admin

export const getSaleStatsCtrl = asyncHandler(async(req,res)=>{
    const salesStats = await Order.aggregate([
        {
            $group:{
                _id: null,
                totalSale: {
                    $sum: "$totalPrice"
                },
                minimumSale: {
                    $min: "$totalPrice"
                },
                maximumSale:{
                    $max: "$totalPrice"
                },
                averageSale : {
                    $avg: "$totalPrice"
                }
            }
        }
    ])
    const date = new Date
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const saleToday = await Order.aggregate([
        {
            $match:{
                createdAt: {
                    $gte: today
                }
            }
        },
        {
            $group:{
                _id : null,
                todaySales: {
                    $sum : "$totalPrice"
                }
            }
        }
    ])
    res.status(200).json({
        success: true,
        msg: "Sales stats fetched successfully",
        salesStats,
        saleToday
        
    })
})

