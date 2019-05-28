const express = require('express')
const router = express.Router()
const checkAuth = require('../Middleware/check-auth')
const OrdersController = require('../Controllers/orders')

/**
 @route   GET /orders/
 @desc    Get all orders
 @access  Private
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    null
*/
router.get('/', checkAuth, OrdersController.get_all_orders)

/**
 @route   POST /orders/
 @desc    Create a new order, from a productID
 @access  Public
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    raw/json - { "productID": mongoose.Schema.Types.ObjectId, "quantity": Number}
*/
router.post('/', checkAuth, OrdersController.create_order)

/**
 @route   GET /orders/:orderId
 @desc    Get an individual order based on an orderId
 @access  Public
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    null
 */
router.get('/:orderId', checkAuth, OrdersController.get_single_order)

/**
 @route   PATCH /orders/:orderId
 @desc    Update an individual order based on an orderId
 @access  Public
 @body    TODO
*/
router.patch('/:orderId', checkAuth, (req, res, next) => {
  res.status(200).json({
    message: 'Updated order'
  })
})

/**
 @route   DELETE /orders/:orderId
 @desc    Delete an individual order based on an orderId
 @access  Public
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    null
*/
router.delete('/:orderId', checkAuth, OrdersController.delete_order)

module.exports = router
