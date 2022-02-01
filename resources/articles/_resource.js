
export default ({ $table, $schema, $format, $images, $attributes }) => ({

  async findPaginated(query, options) {
    let items, pagination

    const result = await $table.findPaginated(query, options)

    items = await $format.fillMany(result.items)
    pagination = result.pagination

    return {
      items,
      pagination,
    }
  },

  async findMany(query, options) {
    let items
    items = await $table.findMany(query, options)
    items = await $format.fillMany(items)
    return items
  },

  async findOne(query) {
    let item
    item = await $table.findOne(query)
    item = await $format.fillOne(item)
    return item
  },

  async insertOne({ images, attributes, ...item }) {
    let id

    $schema.validateOne(item)

    item = await $format.cleanOne(item)
    id = await $table.insertOne(item)

    await $images.insertMany(images, { fkArticle: id })
    await $attributes.insertMany(attributes, { fkArticle: id, fkCategory: item.fkCategory })

    return id
  },

  async insertMany(items = []) {
    let result
    result = items.map((item) => this.insertOne(item))
    result = await Promise.all(result)
    return result
  },

  async updateOne({ id }, { images, category, attributes, ...item }) {
    let result

    $schema.validateOne(item)

    result = await $table.updateOne({ id }, item)

    await $images.updateMany({ fkArticle: id }, images)
    await $attributes.removeMany({ fkArticle: id })
    await $attributes.insertMany(attributes, { fkArticle: id, fkCategory: item.fkCategory })

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

  async removeOne({ id }) {
    let result
    result = $table.removeOne({ id })
    await $images.removeMany({ fkArticle: id })
    return result
  },

})
