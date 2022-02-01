import useTable from '@packages/table'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const table = useTable('category')

  const $section = useTable('section')

  const schema = useSchema()
  const format = useFormat({ $section })

  return useResource({
    table,
    schema,
    format,
  })
}
