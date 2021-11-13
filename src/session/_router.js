import express from 'express'

export default ({ endpoint }) => {
  const router = express.Router()

  router.get('/', endpoint.getSession)
  
  return router
}