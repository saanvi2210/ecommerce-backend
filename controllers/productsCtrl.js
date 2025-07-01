import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Brand from '../models/Brand.js'

//@desc create new product
//@route POST /api/v1/addProduct
//@access Private/admin
export const createProductCtrl = asyncHandler(async(req, res)=>{
    const {name, description, brand, category, sizes, colors, user, price, totalQty} = req.body
    // check if product already exists
    const productExists = await Product.findOne({name})
    if(productExists){
        throw new Error('Product already exists')
    }
    // check if category exists
    const categoryFound = await Category.findOne({name : category})
    if(!categoryFound){
        throw new Error('Category not found, please create category first or check category name.')
    }
    // check if brand exists
    const brandFound = await Brand.findOne({name : brand})
    if(!brandFound){
        throw new Error('Brand not found')
    }
    const product = await Product.create({
        name, description, brand, category, sizes, colors, user: req.userAuthId, price, totalQty
    })
    //push the product into category
    categoryFound.products.push(product._id)
    //resave
    await categoryFound.save()
    //push the product into brand
    brandFound.products.push(product._id)
    //resave
    await brandFound.save()
    //send the response
    res.status(201).json({
        status: "success",
        msg : "Product created successfully",
        product
    })
    // check if the user is an admin or not

})

//@desc get all products
//@route GET /api/v1/getProducts
//@access Public

export const getProductsCtrl = asyncHandler(async(req, res)=>{
    let productQuery = Product.find()
    // search product by name
    if (req.query.name){
        productQuery = productQuery.find({name : {$regex: req.query.name, $options: "i"}})
    }
    // search product by brand
    if (req.query.brand){
        productQuery = productQuery.find({brand : {$regex: req.query.brand, $options: "i"}})
    }
    // search product by category
    if (req.query.category){
        productQuery = productQuery.find({category : {$regex: req.query.category, $options: "i"}})
    }
    // search product by sizes
    if (req.query.sizes){
        productQuery = productQuery.find({sizes : {$regex: req.query.sizes, $options: "i"}})
    }
    // search product by colors
    if (req.query.colors){
        productQuery = productQuery.find({colors : {$regex: req.query.colors, $options: "i"}})
    }
    //search products by price range
    if (req.query.price){
        const priceRange = req.query.price.split('-')
        productQuery = productQuery.find({price: {$gte: priceRange[0], $lte: priceRange[1]}})
    }
    //pagination
    //page
    const page = req.query.page ? parseInt(req.query.page) : 1
    //limit
    const limit = req.query.limit ? parseInt(req.query.limit) : 10
    //startIdx
    const startIdx = (page-1)*limit
    //endIdx
    const endIdx = page*limit
    //total
    const total = await Product.countDocuments()
    //pagination
    const pagination = {}
    if (endIdx < total){
        pagination.next = {
            page : page+1,
            limit
        }
    }
    if(startIdx > 0){
        pagination.prev = {
            page : page-1,
            limit
        }
    }
    productQuery = productQuery.skip(startIdx).limit(limit);
    const products = await productQuery
    res.json({
        status : "Success",
        total,
        results : products.length,
        message : "products fetched successfully",
        pagination : pagination,
        products
    })
})

//@desc get single product by id using params
//@route GET /api/v1/getProducts/:id
//@access Public

export const getProductByIdCtrl = asyncHandler(async(req, res)=>{
    const product = await Product.findById(req.params.id).populate("reviews")
    if(!product){
        throw new Error('Product not found')
    }
    res.json({
        status : "success",
        message : "product fetched",
        product
    })
})

//@desc update product
//@route PUT /api/v1/products/update/:id
//@access Private/admin

export const updateProductCtrl = asyncHandler(async(req, res)=>{
    const {name, description, brand, category, sizes, colors, user, price, totalQty} = req.body
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name, description, brand, category, sizes, colors, user: req.userAuthId, price, totalQty
    },
    {
        new : true
    })
    res.json({
        status : "success",
        message: "product updated successfully",
        product
    })

})

//@desc delete product
//@route Delete /api/v1/products/delete/:id
//@access Private/admin

export const deleteProductCtrl = asyncHandler(async(req, res)=>{
    const product = await Product.findById(req.params.id)
    if (!product){
        throw new Error('No product found to delete')
    }
    await Product.findByIdAndDelete(req.params.id)
    res.json({
        status: "success",
        message: "product deleted successfully"
    })
})