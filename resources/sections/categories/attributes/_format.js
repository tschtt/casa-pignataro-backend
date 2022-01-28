import makeFormat from '@packages/format'

export default ({ $options }) => makeFormat({

  async clean({ id, fkCategorie, active, name }) {
    active = !!active
    return {
      id,
      active,
      name,
    }
  },

  async fill(item) {
    item.options = await $options.findMany({ fkAttribute: item.id })
    return item
  },

})
