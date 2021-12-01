
export default ({ table }) => ({

  async findMany(query, { hidePassword = true, ...options } = {}) {
    let items

    items = await table.findMany(query, options)

    if (hidePassword) {
      items = items.map((item) => { delete item.password; return item })
    }

    return items
  },

  async findOne(query, { hidePassword = true, ...options } = {}) {
    const item = await table.findOne(query, options)

    if (item && hidePassword) {
      delete item.password
    }

    return item
  },

  async insertOne(item, options) {
    item.password = process.env.DEFAULT_PASSWORD
    const result = await table.insertOne(item, options)
    return result
  },

  async updateOne(query, item, options) {
    delete item.password
    const result = await table.updateOne(query, item, options)
    return result
  },

  async upsertOne({ id, ...item }, options) {
    if (id) {
      const wasChanged = await this.updateOne({ id }, item, options)
      if (wasChanged) {
        return id
      }
    }
    return this.insertOne(item, options)
  },

  async removeOne(query, options) {
    const result = await table.removeOne(query, options)
    return result
  },

})
