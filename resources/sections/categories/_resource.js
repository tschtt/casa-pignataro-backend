
export default ({ table, $attributes, schema, format }) => ({

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

  async insertOne({ attributes = [], ...item } = {}) {
    schema.validateOne(item)

    const id = await table.insertOne(item)

    await $attributes.insertMany(attributes, { fkCategory: id })

    return id
  },

  async insertMany(items = [], globals = {}) {
    items = items.map((item) => ({ ...item, ...globals }))
    items = items.map((item) => this.insertOne(item))
    items = await Promise.all(items)
    return items
  },

  async updateOne({ id, attributes = [], ...item } = {}) {
    schema.validateOne(item)

    const count = await table.updateOne({ id }, item)

    await $attributes.removeMany({ id: { $nin: attributes }, fkCategory: id })
    await $attributes.upsertMany(attributes, { fkCategory: id })

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
    await $attributes.removeMany({ fkCategory: id })
    return table.removeOne({ id })
  },

  async removeMany(query) {
    const items = await table.findMany(query)
    if (items.length) {
      await $attributes.removeMany({ fkCategory: { $in: items.map((item) => item.id) } })
      return table.removeMany({ id: { $in: items } })
    }
    return 0
  },

})
