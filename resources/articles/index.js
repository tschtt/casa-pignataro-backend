import useTable from '@packages/table'

import useImages from './images/index.js'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export const $images = useImages()

export default () => {
  const $table = useTable('article')
  const $schema = useSchema()
  const $format = useFormat({ $images })

  const $articles = useResource({
    $table,
    $schema,
    $format,
    $images,
  })

  return $articles
}
