const User = require('../Models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.get_user = (req, res, next) => {
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
}

exports.login_user = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      console.log(user)
      if (user.length < 1) {
        return res.status(401).json({ message: 'Auth failed' })
      }
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (error) {
          return res.status(401).json({ message: 'Auth failed (bcrypt)' })
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
      res.status(500).json({ message: 'Auth failed' })
    })
}

exports.delete_user = (req, res, next) => {
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
}
