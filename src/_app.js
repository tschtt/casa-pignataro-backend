import express from 'express'

import administradores from './administradores/index.js'
import empresa from './empresa/index.js'
import sesion from './sesion/index.js'

const URL = process.env.URL

const app = express()

app.use('/administradores', administradores)
app.use('/empresa', empresa)
app.use('/sesion', sesion)

app.get('/', (req, res, next) => {
  res.send({
    success: true,
    message: 'Bienvenido a la API de Casa Pignataro!',
    links: [
      `${URL}/administradores`,
      `${URL}/empresa/metodos-de-pago`,
      `${URL}/empresa/`,
    ]
  })
})

export default app