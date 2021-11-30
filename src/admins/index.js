import useTable from '@packages/table'
import useController from './_controller.js'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

const table = useTable('admin')

export const controller = useController({ table })
export const endpoint = useEndpoint({ controller })
export const router = useRouter({ endpoint })

export default router