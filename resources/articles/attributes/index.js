import useTable from '@packages/table'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const $table = useTable('nn_article_attribute_value')

  const $attributes = useTable('attribute')
  const $values = useTable('attribute_value')

  const $schema = useSchema()
  const $format = useFormat({ $attributes, $values })

  return useResource({
    $table,
    $attributes,
    $values,
    $schema,
    $format,
  })
}
