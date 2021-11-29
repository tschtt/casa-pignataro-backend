import { middleware as admin } from '@packages/auth'
import express from 'express'

export default ({ controller }) => {
  const router = express.Router()

  router.get('/:id', admin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id)
      const item = await controller.findOne({ id })
      res.send({ success: true, item })
    } catch (error) {
      next(error)
    }
  })
  
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