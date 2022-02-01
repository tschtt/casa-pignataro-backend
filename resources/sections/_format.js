import makeFormat from '@packages/format'

export default ({ $categories }) => makeFormat({

  async clean({ id, active, name }) {
    active = !!active
    return {
      id,
      active,
      name,
    }
  },

  async fill(item = {}) {
    item.categories = await $categories.findMany({ fkSection: item.id })
    return item
  },

})
