import useTable from '@packages/table'

import useCategories from './categories/index.js'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const table = useTable('section')

  const $categories = useCategories()

  const schema = useSchema()
  const format = useFormat({ $categories })

  return useResource({
    table,
    $categories,
    schema,
    format,
  })
}
