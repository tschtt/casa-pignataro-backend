import useTable from '@packages/table'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export default () => {
  const table = useTable('attribute_value')
  const article_option = useTable('nn_article_attribute_value')

  const schema = useSchema()
  const format = useFormat()

  return useResource({
    table,
    article_option,
    schema,
    format,
  })
}
