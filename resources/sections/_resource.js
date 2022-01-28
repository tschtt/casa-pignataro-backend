
export default ({ table, $categories, schema, format }) => ({

  async findMany(query, options) {
    let items
    items = await table.findMany(query, options)
    items = await format.fillMany(items)
    return items
  },

  async findOne(query) {
    let item
    item = await table.findOne(query)
    item = await format.fillOne(item)
    return item
  },

  async insertOne({ categories = [], ...item } = {}) {
    schema.validateOne(item)

    const id = await table.insertOne(item)

    await $categories.insertMany(categories, { fkSection: id })

    return id
  },

  async insertMany(items = [], globals = {}) {
    items = items.map((item) => ({ ...item, ...globals }))
    items = items.map((item) => this.insertOne(item))
    items = await Promise.all(items)
    return items
  },

  async updateOne({ id, categories = [], ...item } = {}) {
    schema.validateOne(item)

    const count = await table.updateOne({ id }, item)

    await $categories.removeMany({ id: { $nin: categories }, fkSection: id })
    await $categories.upsertMany(categories, { fkSection: id })

    return count
  },

  async updateMany(items = [], globals = {}) {
    items = items.map((item) => ({ ...item, ...globals }))
    items = items.map((item) => this.updateOne(item))
    items = await Promise.all(items)
    return items
  },

  async upsertOne(item) {
    return item.id
      ? this.updateOne(item)
      : this.insertOne(item)
  },

  async upsertMany(items = [], globals = {}) {
    items = items.map((item) => ({ ...item, ...globals }))
    items = items.map((item) => this.upsertOne(item))
    items = await Promise.all(items)
    return items
  },

  async removeOne({ id }) {
    await $categories.removeMany({ fkSection: id })
    return table.removeOne({ id })
  },

  async removeMany(query) {
    const items = await table.findMany(query)
    if (items.length) {
      await $categories.removeMany({ fkSection: { $in: items.map((item) => item.id) } })
      return table.removeMany({ id: { $in: items } })
    }
    return 0
  },

})
