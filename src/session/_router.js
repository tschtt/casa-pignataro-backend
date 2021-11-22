import express from 'express'

const handler = (endpoint) => async (req, res, next) => {
  try {
    const result = await endpoint({ request: req })
    res.send(result)
  } catch (error) {
    switch (error.name) {
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
        console.log(error)
        res.status(500).send({ success: false, message: 'Error interno' })
        break;
    }
  }
}

export default ({ endpoint }) => {
  const router = express.Router()

  router.post('/', handler(endpoint.login))
  
  return router
}