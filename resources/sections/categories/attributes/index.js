import useTable from '@packages/table'

import useOptions from './options/index.js'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const table = useTable('attribute')

  const $options = useOptions()

  const schema = useSchema()
  const format = useFormat({ $options })

  return useResource({
    table,
    $options,
    schema,
    format,
  })
}
