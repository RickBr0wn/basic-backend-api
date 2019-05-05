const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../Models/order')
const Product = require('../Models/product')

// @route   GET /orders/
// @desc    Get all orders
// @access  Public/
// @body    null
router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

// @route   POST /orders/
// @desc    Create a new order, from a productID
// @access  Public
// @body    Object - { "productID": mongoose.Schema.Types.ObjectId, "quantity": Number}
router.post('/', (req, res, next) => {
  console.log('REQ.BODY: ', req.body)
  Product.findById(req.body.productID)
    .then(product => {
      console.log('PRODUCT: ', product)
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productID
      })
      return order.save()
    })
    .then(result => {
      console.log('RESULT: ', result.product)
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

// @route   GET /orders/:orderId
// @desc    Get an individual order based on an orderId
// @access  Public
// @body    null
router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

// @route   PATCH /orders/:orderId
// @desc    Update an individual order based on an orderId
// @access  Public
// @body    TODO
router.patch('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated order'
  })
})

// @route   DELETE /orders/:orderId
// @desc    Delete an individual order based on an orderId
// @access  Public
// @body    null
router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: { productID: 'ID', quantity: 'Number' }
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

module.exports = router
