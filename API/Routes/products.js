const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../Models/product')

// @route   GET /products/
// @desc    Get all products
// @access  Public
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

// @route   GET /products/:productID
// @desc    Get an individual product based on id
// @access  Public
router.get('/:productID', (req, res, next) => {
  const id = req.params.productID
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

// @route   PATCH /products/:productID
// @desc    Update an individual product based on id
// @access  Public
router.patch('/:productId', require('body-parser').json(), (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const [propName, value] of req.body) {
    updateOps[propName] = value
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

// @route   DELETE /products/:productID
// @desc    Delete an individual product based on id
// @access  Public
router.delete('/:productID', (req, res, next) => {
  const id = req.params.productID
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
