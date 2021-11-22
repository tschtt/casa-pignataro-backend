import express from 'express'

const handler = (endpoint) => async (req, res, next) => {
  try {
    const result = await endpoint({ request: req, response: res, next })
    if(result) {
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
  
  return router
}