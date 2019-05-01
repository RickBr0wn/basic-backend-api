const express = require('express')
const router = express.Router()

// @route   GET /orders/
// @desc    Get all orders
// @access  Public
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched'
  })
})

// @route   POST /orders/
// @desc    Get all orders
// @access  Public
router.post('/', require('body-parser').json(), (req, res, next) => {
  const order = {
    productID: req.body.productID,
    quantity: req.body.quantity
  }
  res.status(201).json({
    message: 'Orders were fetched',
    order
  })
})

// @route   GET /orders/:orderID
// @desc    Get an individual order based on id
// @access  Public
router.get('/:orderID', (req, res, next) => {
  res.status(200).json({
    message: 'Order details',
    orderID: req.params.orderID
  })
})

// @route   PATCH /orders/:orderID
// @desc    Update an individual order based on id
// @access  Public
router.patch('/:orderID', (req, res, next) => {
  res.status(200).json({
    message: 'Updated order'
  })
})

// @route   DELETE /orders/:orderID
// @desc    Delete an individual order based on id
// @access  Public
router.delete('/:orderID', (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted',
    orderID: req.params.orderID
  })
})

module.exports = router
