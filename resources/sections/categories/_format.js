import makeFormat from '@packages/format'

export default ({ $attributes }) => makeFormat({

  async clean({ id, fkSection, active, name }) {
    active = !!active
    return {
      id,
      active,
      name,
    }
  },

  async fill(item) {
    item.attributes = await $attributes.findMany({ fkCategory: item.id })
    return item
  },

})
