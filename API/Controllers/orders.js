const Order = require('../Models/order')
const Product = require('../Models/product')
const mongoose = require('mongoose')

exports.get_all_orders = (req, res, next) => {
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
}

exports.create_order = (req, res, next) => {
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
}

exports.get_single_order = (req, res, next) => {
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
}

exports.delete_order = (req, res, next) => {
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
}
