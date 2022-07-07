import { useRouter } from '@packages/router'
import useTable from '@packages/table'
import useImages from '@app/resources/articles/images/index.js'

const table = useTable('/sections')
const images = useImages()

async function findMany() {
  const rows = await table.raw(`
    select 
      section.id,
      section.name,
      article.id as articleId,
      article.name as articleName,
      article.shortDescription as articleShortDescription,
      article.value as articleValue
    from section
    inner join category on category.active = 1 and category.fkSection = section.id
    inner join article on article.active = 1 and article.fkCategory = category.id
    where section.active = 1
  `)

  const sections = []

  for (const row of rows) {
    const index = sections.findIndex(section => section.id === row.id)
    if (index === -1) {
      sections.push({
        id: row.id,
        name: row.name,
        articles: [
          {
            id: row.articleId,
            name: row.articleName,
            shortDescription: row.articleShortDescription,
            value: row.articleValue,
            images: images.findMany({ fkArticle: row.articleId }),
          },
        ],
      })
    } else if (sections[index].articles.length < 4) {
      sections[index].articles.push({
        id: row.articleId,
        name: row.articleName,
        shortDescription: row.articleShortDescription,
        value: row.articleValue,
        images: images.findMany({ fkArticle: row.articleId }),
      })
    }
  }

  return sections
}

export default useRouter({
  '/': {
    get: findMany,
  },
})
