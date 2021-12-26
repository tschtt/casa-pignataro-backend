import useTable from '@packages/table'
import useResource from './_resource.js'

export default () => {
  const $table = useTable('categorie')
  const $resource = useResource({ $table })
  return $resource
}
