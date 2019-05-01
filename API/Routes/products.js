const express = require('express')
const router = express.Router()

// @route   GET /products/
// @desc    Get all products
// @access  Public
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /products'
  })
})

// @route   POST /products/
// @desc    Post a new product
// @access  Public
router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'Handling POST requests to /products'
  })
})

// @route   GET /products/:productID
// @desc    Get an individual product based on id
// @access  Public
router.get('/:productID', (req, res, next) => {
  const id = req.params.productID
  if (id === 'special') {
    res.status(200).json({
      message: 'You discovered the special ID',
      id: id
    })
  } else {
    res.status(200).json({
      message: 'You passed an ID'
    })
  }
})

// @route   PATCH /products/:productID
// @desc    Update an individual product based on id
// @access  Public
router.patch('/:productID', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product'
  })
})

// @route   DELETE /products/:productID
// @desc    Delete an individual product based on id
// @access  Public
router.delete('/:productID', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted product'
  })
})

module.exports = router
