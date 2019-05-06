const express = require('express')
const router = express.Router()
const multer = require('multer')
const ProductsController = require('../Controllers/products')

// Helper functions
const oneMegabyte = 1024 * 1024

// Middlewares
const checkAuth = require('../Middleware/check-auth')

// MULTER CONFIG -> START
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads')
  },
  filename: function(req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  // reject a fille
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: oneMegabyte * 5
  },
  fileFilter
})
// MULTER CONFIG -> END

// @route   GET /products/
// @desc    Get all products
// @access  Public
// @body    null
router.get('/', ProductsController.get_all_products)

// @route   POST /products/
// @desc    Post a new product
// @access  Public
// @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
// @body    form-data - { name: String, price: Number, productImage: file }
router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductsController.create_product
)

// @route   GET /products/:productId
// @desc    Get an individual product based on id
// @access  Public
// @body    null
router.get('/:productId', ProductsController.get_single_product)

// @route   PATCH /products/:productId
// @desc    Update an individual product based on id
// @access  Public
// @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
// @body    raw/json - [{ "propName": String, "value": String }]
router.patch('/:productId', checkAuth, ProductsController.patch_product)

// @route   DELETE /products/:productId
// @desc    Delete an individual product based on id
// @access  Public
// @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
// @body    null
router.delete('/:productId', checkAuth, ProductsController.delete_product)

module.exports = router
