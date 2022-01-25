import { makeFormat } from '@packages/format'

export default ({ $images }) => makeFormat({

  async clean(
    {
      id = 0,
      active = true,
      fkCategorie = 0,
      code = '',
      name = '',
      value = 0,
      shortDescription = '',
      description = '',
    } = {},
  ) {
    return {
      id,
      active,
      fkCategorie,
      code,
      name,
      value,
      shortDescription,
      description,
    }
  },

  async fill(article) {
    article.images = await $images.findMany({ fkArticle: article.id })
    return article
  },

})
