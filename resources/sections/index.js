import useTable from '@packages/table'

import useCategories from './categories/index.js'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export const $categories = useCategories()

export default () => {
  const table = useTable('section')

  const schema = useSchema()
  const format = useFormat({ $categories })

  return useResource({
    table,
    $categories,
    schema,
    format,
  })
}
