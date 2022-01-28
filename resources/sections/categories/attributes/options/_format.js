import makeFormat from '@packages/format'

export default () => makeFormat({

  async clean({ id, fkAttribute, active, name }) {
    active = !!active
    return {
      id,
      active,
      name,
    }
  },

  async fill(item) {
    return item
  },

})
