import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/:id': {
    get: endpoint.findOne,
  },
  '/': {
    get: endpoint.findMany,
  },
})
