const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

// @route   GET /users/
// @desc    Get a user
// @access  Public
// @body    raw/json - { email: String, password: String }
router.post('/signup/', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Mail exists'
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            })
            user
              .save()
              .then(result => {
                console.log(result)
                res.status(201).json({
                  message: 'User created'
                })
              })
              .catch(err => {
                console.log(err)
                res.status(500).json({
                  error: err
                })
              })
          }
        })
      }
    })
})

// @route   GET /login/
// @desc    Login a user
// @access  Public
// @body    raw/json - { email: String, password: String }
router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      console.log(user)
      if (user.length < 1) {
        return res.status(401).json({ message: 'Auth failed' })
      }
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (error) {
          return res.status(401).json({ message: 'Auth failed' })
        }
        if (result) {
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          )
          return res.status(200).json({ message: 'Auth successful', token })
        }
        res.status(401).json({ message: 'Auth failed' })
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
})

// @route   DELETE /users/:userId
// @desc    Delete an individual user based on userId
// @access  Public
// @body    null
router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error
      })
    })
})

module.exports = router
