const express = require('express')
const router = express.Router()
const ProductsController = require('../Controllers/products')

// Middlewares
const checkAuth = require('../Middleware/check-auth')
const upload = require('../Middleware/multer-config')

/**
 @route   GET /products/
 @desc    Get all products
 @access  Public
 @body    null
*/
router.get('/', ProductsController.get_all_products)

/**
 @route   POST /products/
 @desc    Post a new product
 @access  Public
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    form-data - { name: String, price: Number, productImage: file }
*/
router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductsController.create_product
)

/**
 @route   GET /products/:productId
 @desc    Get an individual product based on id
 @access  Public
 @body    null
*/
router.get('/:productId', ProductsController.get_single_product)

/**
 @route   PATCH /products/:productId
 @desc    Update an individual product based on id
 @access  Public
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    raw/json - [{ "propName": String, "value": String }]
*/
router.patch('/:productId', checkAuth, ProductsController.patch_product)

/**
 @route   DELETE /products/:productId
 @desc    Delete an individual product based on id
 @access  Public
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    null
*/
router.delete('/:productId', checkAuth, ProductsController.delete_product)

module.exports = router
