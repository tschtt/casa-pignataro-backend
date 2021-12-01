import express from 'express'

import admins from './admins/index.js'
import company from './company/index.js'
import session from './session/index.js'

const URL = process.env.APP_URL

const app = express()

app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

app.use('/admins', admins)
app.use('/company', company)
app.use('/session', session)

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: "Welcome to Casa Pignataro's API",
    links: [
      `${URL}/admins`,
      `${URL}/company/payment-methods`,
      `${URL}/company/`,
    ],
  })
})

app.use((error, req, res) => {
  switch (error.name) {
    case 'AuthenticationFailedError':
      res.status(401).send({ success: false, message: error.message })
      break
    case 'MissingDataError':
      res.status(400).send({ success: false, message: error.message })
      break
    case 'InvalidUsernameError':
      res.status(404).send({ success: false, message: error.message })
      break
    case 'UnauthorizedError':
    case 'InvalidTokenError':
    case 'InvalidPasswordError':
      res.status(401).send({ success: false, message: error.message })
      break
    default:
      // eslint-disable-next-line no-console
      console.error(error.stack)
      res.status(500).send({ success: false, message: 'Error interno' })
      break
  }
})

export default app
