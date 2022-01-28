import makeFormat from '@packages/format'

export default () => makeFormat({

  async clean({ id, fkSection, active, name }) {
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
