import { middleware as admin } from '@packages/auth'
import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/:id': {
    get:    [ admin, endpoint.findOne   ],
    put:    [ admin, endpoint.upsertOne ],
    delete: [ admin, endpoint.removeOne ],
  },
  '/': {
    get: [ admin, endpoint.findMany  ],
    put: [ admin, endpoint.upsertOne ],
  },
})
