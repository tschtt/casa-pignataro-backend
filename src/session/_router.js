import { middleware as admin } from '@packages/auth'
import express from 'express'

const handler = (endpoint) => async (req, res, next) => {
  try {
    const result = await endpoint({ request: req, response: res, next })
    if (result) {
      res.send(result)
    }
  } catch (error) {
    next(error)
  }
}

export default ({ endpoint }) => {
  const router = express.Router()

  router.post('/refresh', handler(endpoint.refresh))
  router.post('/', handler(endpoint.login))

  router.delete('/', admin, handler(endpoint.logout))

  return router
}
