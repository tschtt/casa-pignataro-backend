import { $admins } from '@app/resources'

import useTable from '@packages/table'
import useController from './_controller.js'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

const table = useTable('admin')

export const controller = useController({ table })
export const endpoint = useEndpoint({ controller, $admins })
export const router = useRouter({ endpoint })

export default router
