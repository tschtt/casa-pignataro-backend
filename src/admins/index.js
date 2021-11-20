import useTable from '@packages/table'
import useController from './_controller.js'
import useRouter from './_router.js'

const table = useTable('admin')

export const controller = useController({ table })

export default useRouter()