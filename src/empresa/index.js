import express from 'express'

import metodos_de_pago from './metodos-de-pago/index.js'

const router = express.Router()

router.use('/metodos-de-pago', metodos_de_pago)

router.get('/', (req, res, next) => {
  res.send({
    success: false,
    message: 'La ruta GET /empresa no esta implementada'
  })
})

export default router