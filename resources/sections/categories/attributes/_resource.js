
export default ({ table, $options, schema, format }) => ({

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

  async insertOne({ options = [], ...item } = {}) {
    schema.validateOne(item)

    const id = await table.insertOne(item)

    await $options.insertMany(options, { fkAttribute: id })

    return id
  },

  async insertMany(items = [], globals = {}) {
    items = items.map((item) => ({ ...item, ...globals }))
    items = items.map((item) => this.insertOne(item))
    items = await Promise.all(items)
    return items
  },

  async updateOne({ id, options = [], ...item } = {}) {
    schema.validateOne(item)

    const count = await table.updateOne({ id }, item)

    await $options.removeMany({ id: { $nin: options }, fkAttribute: id })
    await $options.upsertMany(options, { fkAttribute: id })

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
    await $options.removeMany({ fkAttribute: id })
    return table.updateOne({ id }, { active: false })
  },

  async removeMany(query) {
    const items = await table.findMany(query)
    if (items.length) {
      await $options.removeMany({ fkAttribute: { $in: items.map((item) => item.id) } })
      return table.updateMany({ id: { $in: items } }, { active: false })
    }
    return 0
  },

})
