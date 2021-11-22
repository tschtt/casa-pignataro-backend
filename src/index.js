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

app.use((error, req, res, next) => {
  switch (error.name) {
    case 'AuthenticationFailedError':
      res.status(401).send({ success: false, message: error.message })
      break;
    case 'MissingDataError':
      res.status(400).send({ success: false, message: error.message })
      break;
    case 'InvalidUsernameError':
      res.status(404).send({ success: false, message: error.message })
      break;
    case 'UnauthorizedError':
    case 'InvalidTokenError':
    case 'InvalidPasswordError':
      res.status(401).send({ success: false, message: error.message })
      break;
    default:
      console.error(error.stack)
      res.status(500).send({ success: false, message: 'Error interno' })
      break;
  }
})

export default app