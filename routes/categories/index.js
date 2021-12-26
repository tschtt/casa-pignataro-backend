import { $categories } from '@app/resources'

import useTable from '@packages/table'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const table = useTable('categorie')
export const endpoint = useEndpoint({ table, $categories })
export const router = useRouter({ endpoint })

export default router
