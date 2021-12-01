import { middleware as admin } from '@packages/auth'
import { express, handler } from '@packages/router'

export default ({ endpoint }) => {
  const router = express.Router()

  router.get('/:id', admin, handler(endpoint.findOne))
  router.get('/', admin, handler(endpoint.findMany))

  router.put('/:id', admin, handler(endpoint.upsertOne))
  router.put('/', admin, handler(endpoint.upsertOne))

  router.delete('/:id', admin, handler(endpoint.removeOne))

  return router
}
