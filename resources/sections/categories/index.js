import useTable from '@packages/table'

import useAttributes from './attributes/index.js'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const table = useTable('category')

  const $attributes = useAttributes()

  const schema = useSchema()
  const format = useFormat({ $attributes })

  return useResource({
    table,
    $attributes,
    schema,
    format,
  })
}
