import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send({
    success: false,
    message: 'Not implemented',
  })
})

export default router
