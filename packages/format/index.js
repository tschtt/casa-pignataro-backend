
export const makeFormatter = ({ clean, fill }) => ({

  async cleanOne(item = {}) {
    if (clean) {
      item = await clean({ ...item })
    }
    return item
  },

  async cleanMany(items = [], globals = {}) {
    if (clean) {
      items = await items.map((item) => clean({ ...item, ...globals }))
      items = await Promise.all(items)
    }
    return items
  },

  async fillOne(item = {}) {
    if (fill) {
      item = await fill({ ...item })
    }
    return item
  },

  async fillMany(items = [], globals = {}) {
    if (fill) {
      items = await items.map((item) => fill({ ...item, ...globals }))
      items = await Promise.all(items)
    }
    return items
  },

})

export default makeFormatter
