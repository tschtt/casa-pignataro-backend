import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.send({
    success: false,
    message: 'La ruta GET /empresa/metodos-de-pago no esta implementada'
  })
})

export default router