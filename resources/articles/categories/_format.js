import makeFormat from '@packages/format'

export default ({ $section }) => makeFormat({

  async clean({ id, fkSection, active, name }) {
    active = !!active
    return {
      id,
      fkSection,
      active,
      name,
    }
  },

  async fill(item) {
    const section = await $section.findOne({ id: item.fkSection })
    item.section = section.name
    return item
  },

})
