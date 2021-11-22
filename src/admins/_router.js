import { middleware as admin } from '@packages/auth'
import express from 'express'

export default ({ controller }) => {
  const router = express.Router()
  
  router.get('/', admin, async (req, res, next) => {
    try {
      const items = await controller.findMany()      
      res.send({ success: true, items })
    } catch (error) {
      next(error)
    }
  })
  
  return router
}