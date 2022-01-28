import useTable from '@packages/table'

import useImages from './images/index.js'
import useCategories from './categories/index.js'
import useAttributes from './attributes/index.js'

import useSchema from './_schema.js'
import useFormat from './_format.js'
import useResource from './_resource.js'

export const $images = useImages()
export const $categories = useCategories()
export const $attributes = useAttributes()

export default () => {
  const $table = useTable('article')
  const $schema = useSchema()
  const $format = useFormat({ $images, $categories, $attributes })

  const $articles = useResource({
    $table,
    $schema,
    $format,
    $images,
    $categories,
    $attributes,
  })

  return $articles
}
