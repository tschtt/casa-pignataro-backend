import express from 'express'

import paymentMethods from './payment-methods/index.js'

const router = express.Router()

router.use('/payment-methods', paymentMethods)

router.get('/', (req, res) => {
  res.send({
    success: false,
    message: 'Not implemented',
  })
})

export default router
