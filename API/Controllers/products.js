const Product = require('../Models/product')
const mongoose = require('mongoose')

exports.get_all_products = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => ({
          name: doc.name,
          price: doc.price,
          productImage: 'localhost:3000/' + doc.productImage,
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
}

exports.create_product = (req, res, next) => {
  console.log(req.file)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
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
}

exports.get_single_product = (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select('price _id name productImage')
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
}

exports.patch_product = (req, res, next) => {
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
}

exports.delete_product = (req, res, next) => {
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
}
