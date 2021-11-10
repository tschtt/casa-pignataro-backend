import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.send({
    success: false,
    message: 'La ruta GET /sesion no esta implementada'
  })
})

export default router