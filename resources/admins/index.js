import { useTable } from '@packages/table'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const $table = useTable('admin')
  const $schema = useSchema()
  const $format = useFormat()

  const $resource = useResource({ $table, $schema, $format })

  return $resource
}
