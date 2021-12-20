import { middleware as admin } from '@packages/auth'
import { useRouter } from '@packages/router'

export default ({ endpoint, user }) => useRouter({
  '/user': user,
  '/refresh': {
    post: endpoint.refresh,
  },
  '/': {
    post: endpoint.login,
    delete: [admin, endpoint.logout],
  },
})
