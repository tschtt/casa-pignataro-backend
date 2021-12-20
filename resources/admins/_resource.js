
export default ({ $table, $schema, $format }) => ({

  async findMany(query, options) {
    let items
    items = await $table.findMany(query)
    items = await $format.cleanMany(items, options)
    return items
  },

  async findOne(query, options) {
    let item
    item = await $table.findOne(query)
    item = await $format.cleanOne(item, options)
    return item
  },

  async insertOne(item = {}, options = []) {
    let result
    $schema.validateOne(item)
    item = await $format.cleanOne(item, { ...options, defaultPassword: true })
    result = await $table.insertOne(item)
    return result
  },

  async updateOne(query, item) {
    let result
    $schema.validateOne(item)
    item = await $format.cleanOne(item)
    result = await $table.updateOne(query, item)
    return result
  },

  async upsertOne(item, options) {
    let result
    if (!item.id) {
      result = await this.insertOne(item, options)
    } else {
      await this.updateOne({ id: item.id }, item)
      result = item.id
    }

    return result
  },

  removeOne(query) {
    return $table.removeOne(query)
  },

})
