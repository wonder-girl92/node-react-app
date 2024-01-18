const express = require('express')
const User = require('../models/User')
const router = express.Router({ mergeParams: true })

router.patch('/:userId', async (req, res) => {
    try {
        const {userId} = req.params
      if (userId) {
       const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new: true})
        res.send(updatedUser)
      } else {
        res.status(401).json({message: 'Unauthorized'})
      }

    } catch (e) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже.'
      })
    }
})

router.get('/', async (req, res) => {
  try {
    const list = await User.find()
    res.send(list)
  } catch (e) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже.'
    })
  }
})

module.exports = router
