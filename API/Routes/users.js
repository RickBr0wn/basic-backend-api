const express = require('express')
const router = express.Router()
const UserController = require('../Controllers/users')
const checkAuth = require('../Middleware/check-auth')

/**
  @route   POST /users/signup/
  @desc    Sign up a new user
  @access  Public
  @header  { Content-Type: application/json }
  @body    raw/json - { email: String, password: String }
*/
router.post('/signup/', UserController.get_user)

/**
 @route   POST /users/login/
 @desc    Login a user
 @access  Public
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    raw/json - { email: String, password: String }
*/
router.post('/login', UserController.login_user)

/**
 @route   DELETE /users/:userId
 @desc    Delete an individual user based on userId
 @access  Public
 @header  { Content-Type: application/json, Authorization: Bearer + whitespace + jwt token }
 @body    null
*/
router.delete('/:userId', checkAuth, UserController.delete_user)

module.exports = router
