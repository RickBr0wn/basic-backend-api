const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../Models/product')

// @route   GET /products/
// @desc    Get all products
// @access  Public
// @body    null
router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => ({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: 'GET',
            url: 'localhost:3000/products/' + doc._id
          }
        }))
      }
      res.status(200).json(response)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
})

// @route   POST /products/
// @desc    Post a new product
// @access  Public
// @body    Object - { "name": String, "price": Number }
router.post('/', require('body-parser').json(), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  })
  product
    .save()
    .then(result => {
      console.log('Result: ', result)
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'localhost:3000/products/' + result._id
          }
        }
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error
      })
    })
})

// @route   GET /products/:productId
// @desc    Get an individual product based on id
// @access  Public
// @body    null
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select('price _id name')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'localhost:3000/products'
          }
        })
      } else {
        res
          .status(404)
          .json({ message: 'No valid entry found for provided Object ID' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
})

// @route   PATCH /products/:productId
// @desc    Update an individual product based on id
// @access  Public
// @body    Array - [{ "propName": String, "value": String }]
router.patch('/:productId', require('body-parser').json(), (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .select('name price _id')
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http:localhost:3000/products/' + id
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

// @route   DELETE /products/:productId
// @desc    Delete an individual product based on id
// @access  Public
// @body    null
router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product.deleteOne({ _id: id })
    .select('name price _id')
    .exec()
    .then(result =>
      res.status(200).json({
        message: 'Product successfully deleted',
        deletedCount: result.deletedCount,
        request: {
          type: 'POST',
          url: 'localhost:3000/products/',
          body: { name: 'String', price: 'Number' }
        }
      })
    )
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
})

module.exports = router
