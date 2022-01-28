
export const makeFormat = ({ clean, fill }) => ({

  async cleanOne(item = {}, options = {}) {
    if (clean) {
      item = await clean({ ...item }, options)
    }
    return item
  },

  async cleanMany(items = [], { globals, ...options } = {}) {
    if (clean) {
      items = await items.map((item) => clean({ ...item, ...globals }, options))
      items = await Promise.all(items)
    }
    return items
  },

  async fillOne(item = {}, options = {}) {
    if (fill) {
      item = await clean({ ...item }, options)
      item = await fill({ ...item }, options)
    }
    return item
  },

  async fillMany(items = [], { globals, ...options } = {}) {
    if (fill) {
      items = items.map((item) => clean({ ...item, ...globals }, options))
      items = await Promise.all(items)
      items = items.map((item) => fill({ ...item, ...globals }, options))
      items = await Promise.all(items)
    }
    return items
  },

})

export default makeFormat
