import { connection } from '@packages/table'

import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const endpoint = useEndpoint({ connection })
export const router = useRouter({ endpoint })

export default router
