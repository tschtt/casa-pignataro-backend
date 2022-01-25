import { $articles, $categories } from '@app/resources'
import { images as $images } from '@packages/files'

import useTable from '@packages/table'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const table = useTable('article')
export const endpoint = useEndpoint({ table, $articles, $images, $categories })
export const router = useRouter({ endpoint })

export default router
