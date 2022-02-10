import { middleware as admin } from '@packages/auth'
import { middleware as upload } from '@packages/files'
import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/': {
    get: [ admin, endpoint.export ],
    post: [ admin, upload.single('file'), endpoint.import ],
  },
})
