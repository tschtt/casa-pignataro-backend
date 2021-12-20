import { middleware as admin } from '@packages/auth'
import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/': {
    get: [admin, endpoint.find],
    patch: [admin, endpoint.update],
  },
})
