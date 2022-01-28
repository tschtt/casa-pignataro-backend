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
    item.value = await $values.findOne({ id: item.fkAttributeValue })
    item.attribute = await $attributes.findOne({ id: item.value.fkAttribute })
    return {
      id: item.id,
      name: item.attribute.name,
      value: item.value.name,
    }
  },

})
