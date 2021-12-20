import { useTable } from '@packages/table'

import $hash from '@packages/hash'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const $table = useTable('admin')
  const $schema = useSchema()
  const $format = useFormat({ $hash })

  const $resource = useResource({ $table, $schema, $format })

  return $resource
}
