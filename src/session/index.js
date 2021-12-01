import auth from '@packages/auth'
import hash from '@packages/hash'

import useTable from '@packages/table'

import { controller as admins } from '../admins/index.js'

import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

const sessions = useTable('admin_session')
const endpoint = useEndpoint({ auth, hash, admins, sessions })
const router = useRouter({ endpoint })

export default router
