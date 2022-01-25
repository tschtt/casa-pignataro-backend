
export default ({ $table, $schema, $format }) => ({

  async findPaginated(query, options) {
    let items, pagination

    const result = await $table.findPaginated(query, options)

    items = await $format.cleanMany(result.items)
    pagination = result.pagination

    return {
      items,
      pagination,
    }
  },

  async findMany(query, options) {
    let items
    items = await $table.findMany(query, options)
    items = await $format.cleanMany(items)
    return items
  },

  async findOne(query) {
    let item
    item = await $table.findOne(query)
    item = await $format.cleanOne(item)
    return item
  },

  async insertOne(item = {}) {
    let result
    $schema.validateOne(item)
    item = await $format.cleanOne(item, { defaultPassword: true })
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

  async upsertOne(item) {
    let result

    if (!item.id) {
      result = await this.insertOne(item)
    } else {
      await this.updateOne({ id: item.id }, item)
      result = item.id
    }

    return result
  },

  async removeOne(query) {
    return $table.removeOne(query)
  },

})
