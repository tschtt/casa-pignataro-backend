import hash from '@packages/hash'
import useTable from '@packages/table'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

const admins = useTable('admin')
const endpoint = useEndpoint({ hash, admins })
const router = useRouter({ endpoint })

export default router
