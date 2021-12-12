import { middleware as admin } from '@packages/auth'
import { middleware as upload } from '@packages/upload'
import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/:id': {
    get: endpoint.findOne,
    patch: [admin, upload.array('images'), endpoint.updateOne],
    delete: [ admin, endpoint.removeOne ],
  },
  '/': {
    get: endpoint.findMany,
    post: [admin, upload.array('images'), endpoint.insertOne],
  },
})
