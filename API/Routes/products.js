const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../Models/product')

// @route   GET /products/
// @desc    Get all products
// @access  Public
router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs)
      res.status(200).json(docs)
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
      console.log(result)
      res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: result
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
    .exec()
    .then(doc => {
      console.log('From database: ', doc)
      if (doc) {
        res.status(200).json(doc)
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

router.patch('/:productId', require('body-parser').json(), (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json(result)
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
  Product.remove({ _id: id })
    .exec()
    .then(result => res.status(200).json(result))
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
})

module.exports = router
