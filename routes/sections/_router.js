import { middleware as admin } from '@packages/auth'
import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/:id': {
    get: endpoint.findOne,
    put: [admin, endpoint.updateOne],
    delete: [ admin, endpoint.removeOne ],
  },
  '/': {
    get: endpoint.findMany,
    post: [admin, endpoint.insertOne],
  },
})
