require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

// Route imports
const productRoutes = require('./api/Routes/products')
const orderRoutes = require('./api/Routes/orders')
const userRoutes = require('./api/Routes/users')
const bodyParser = require('body-parser')

// Connect to mongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@basic-backend-api-nnvyx.mongodb.net/test?retryWrites=true`,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(data =>
    console.log(
      `Welcome ${process.env.MONGO_USER}, You are now connected to ${
        process.env.MONGO_DB
      }.`
    )
  )
  .catch(err => console.log(err))

mongoose.Promise = global.Promise

// MIDDLEWARES -> START
// Allows request data in server console.log
app.use(morgan('dev'))

// Allows the /uploads folder to be publicly accessible.
// Which in turn will handle routing for GET requests on /uploads folder
app.use('/uploads', express.static('uploads'))

// include bodyParser, so req.body can be accessible
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Handle CORS
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
// MIDDLEWARES -> END

// Routes
app.use('/products/', productRoutes)
app.use('/orders/', orderRoutes)
app.use('/users/', userRoutes)

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
