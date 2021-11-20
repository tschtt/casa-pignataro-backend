import express from 'express'

import admins from './admins/index.js'
import company from './company/index.js'
import session from './session/index.js'

const URL = process.env.APP_URL

const app = express()

app.use('/admins', admins)
app.use('/company', company)
app.use('/session', session)

app.get('/', (req, res, next) => {
  res.send({
    success: true,
    message: "Welcome to Casa Pignataro's API",
    links: [
      `${URL}/admins`,
      `${URL}/company/payment-methods`,
      `${URL}/company/`,
    ]
  })
})

export default app