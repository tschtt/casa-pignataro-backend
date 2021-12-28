import useAdmins from './admins/index.js'
import useCategories from './categories/index.js'
import useArticles from './articles/index.js'

export const $admins = useAdmins()
export const $categories = useCategories()
export const $articles = useArticles()
