import useTable from '@packages/table'
import useImages from './images/index.js'
import useArticles from './_resource.js'

export const $images = useImages()

export default () => {
  const $table = useTable('article')
  const $articles = useArticles({ $table, $images })

  return $articles
}
