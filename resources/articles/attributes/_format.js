import makeFormat from '@packages/format'

export default ({ $attributes, $values }) => makeFormat({

  async clean({ id, fkArticle, fkAttributeValue }) {
    return {
      id,
      fkArticle,
      fkAttributeValue,
    }
  },

  async fill(item) {
    const value = await $values.findOne({ id: item.fkAttributeValue })
    const attribute = await $attributes.findOne({ id: value.fkAttribute })
    return {
      name: attribute.name,
      value: value.name,
    }
  },

})
