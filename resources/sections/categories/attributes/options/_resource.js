
export default ({ table, schema, format }) => ({

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

  async insertOne({ ...item } = {}) {
    let result
    schema.validateOne(item)
    result = await table.insertOne(item)
    return result
  },

  async insertMany(items = [], globals = {}) {
    items = items.map((item) => ({ ...item, ...globals }))
    items = items.map((item) => this.insertOne(item))
    items = await Promise.all(items)
    return items
  },

  async updateOne({ id, ...item } = {}) {
    let result
    schema.validateOne(item)
    result = await table.updateOne({ id }, item)
    return result
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

  async removeOne(query) {
    return table.removeOne(query)
  },

  async removeMany(query) {
    return table.removeMany(query)
  },

})
