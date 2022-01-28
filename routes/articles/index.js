import { $articles } from '@app/resources'

import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const endpoint = useEndpoint({ $articles })
export const router = useRouter({ endpoint })

export default router
