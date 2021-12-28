import fs from 'fs'

import useImages from './_resource.js'

export default () => {
  const $images = useImages({ fs })
  return $images
}
