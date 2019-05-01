const express = require('express')
const app = express()
const morgan = require('morgan')
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

// Allows request data in server console.log
app.use(morgan('dev'))

app.use((req, res, next) => {
  // Second param in .header() limits connection
  // * allows any connection
  // Could be 'https//:mySite.com'
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
})

// Routes
app.use('/products', productRoutes)
app.use('/orders/', orderRoutes)

// Display a 404 - not found page
app.use((req, res, next) => {
  const err = new Error('404 - Not found')
  err.status = 404
  next(err)
})

// Final catch all error
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    err: {
      message: err.message
    }
  })
})

module.exports = app
