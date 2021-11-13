import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

const endpoint = useEndpoint({ auth, hash, admins })
const router = useRouter({ endpoint })

export default router