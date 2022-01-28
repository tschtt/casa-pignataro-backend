import useAdmins from './admins/index.js'
import useCategories from './categories/index.js'
import useArticles from './articles/index.js'
import useSections from './sections/index.js'

export const $admins = useAdmins()
export const $categories = useCategories()
export const $articles = useArticles()
export const $sections = useSections()
