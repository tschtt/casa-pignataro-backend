import express from 'express'

export default () => {
  const router = express.Router()
  
  router.get('/', (req, res, next) => {
    res.send({
      success: false,
      message: 'Not implemented'
    })
  })
  
  return router
}