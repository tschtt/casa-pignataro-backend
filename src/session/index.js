import auth from '@packages/auth'
import hash from '@packages/hash'

import useTable from '@packages/table'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

import user from './user/index.js'

const admins = useTable('admin')
const sessions = useTable('admin_session')
const endpoint = useEndpoint({ auth, hash, admins, sessions })
const router = useRouter({ endpoint, user })

export default router
