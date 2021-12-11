import { useRouter } from '@packages/router'
import { middleware as admin } from '@packages/auth'

export default ({ endpoint }) => useRouter({
  '/:id': {
    patch: [admin, endpoint.updateOne],
  },
  '/': {
    get: endpoint.findMany,
    post: [admin, endpoint.insertOne],
  },
})
