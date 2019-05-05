require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

// Allows request data in server console.log
app.use(morgan('dev'))

// Allows the /uploads folder publicly accessible.
// Which in turn will handle routing for GET requests on /uploads folder
app.use('/uploads', express.static('uploads'))

// Connect to mongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@basic-backend-api-nnvyx.mongodb.net/test?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(data =>
    console.log(
      `Welcome ${process.env.MONGO_USER}, You are now connected to ${
        process.env.MONGO_DB
      }.`
    )
  )
  .catch(err => console.log(err))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// Routes
app.use('/products/', productRoutes)
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
