import useTable from '@packages/table'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const table = useTable('category')

  const schema = useSchema()
  const format = useFormat()

  return useResource({
    table,
    schema,
    format,
  })
}
