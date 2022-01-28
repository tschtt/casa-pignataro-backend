import { makeFormat } from '@packages/format'

export default ({ $images, $categories, $attributes }) => makeFormat({

  async clean(
    {
      id = 0,
      fkCategory = 0,
      active = true,
      code = '',
      name = '',
      value = 0,
      shortDescription = '',
      description = '',
    } = {},
  ) {
    active = !!active
    return {
      id,
      fkCategory,
      active,
      code,
      name,
      value,
      shortDescription,
      description,
    }
  },

  async fill(article) {
    article.category = await $categories.findOne({ id: article.fkCategory })
    article.attributes = await $attributes.findMany({ fkArticle: article.id })
    article.images = await $images.findMany({ fkArticle: article.id })
    delete article.fkCategory
    return article
  },

})
