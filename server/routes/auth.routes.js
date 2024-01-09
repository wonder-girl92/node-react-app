const express = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const { generateUserData } = require('../utils/helpers')
const tokenService = require('../services/token.service')
const router = express.Router({ mergeParams: true })

router.post('/signUp', [
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длина пароля 8 символов').isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        return res.status(400).json({
          error: {
            message: 'INVALID_DATA',
            code: 400,
            // errors: errors.array()
          }
        })
      }
      const { email, password } = req.body
      const exitingUser = await User.findOne({ email })

      if (exitingUser) {
        return res.status(400).json({
          error: {
            message: 'EMAIL_EXISTS',
            code: 400
          }
        })
      }

      const hashedPassword = bcrypt.hash(password, 12)

      const newUser = User.create({
        ...req.body,
        ...generateUserData(),
        password: hashedPassword,
      })
      const tokens = tokenService.generate({ _id: newUser._id })
      await tokenService.save(newUser._id, tokens.refreshToken)

      res.status(201).send({ ...tokens, userId: newUser._id })
    } catch (e) {
      res.status(500).json({
        message: 'на сервере произошла ошибка. Попробуйте позже.'
      })
    }
  }])

router.post('/signInWithPassword', async (req, res) => {

})

router.post('/token', async (req, res) => {

})

module.exports = router
