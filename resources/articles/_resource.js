
export default ({ $table, $schema, $format, $images, $attributes }) => ({

  async findPaginated(query, options) {

    options.join = [
      { type: 'left', table: 'category', on: 'article.fkCategory', equals: 'category.id' },
      { type: 'left', table: 'section', on: 'category.fkSection', equals: 'section.id' },
      { type: 'left', table: 'nn_article_attribute_value', on: 'article.id', equals: 'nn_article_attribute_value.fkArticle' },
      { type: 'left', table: 'attribute_value', on: 'nn_article_attribute_value.fkAttributeValue', equals: 'attribute_value.id' },
      { type: 'left', table: 'attribute', on: 'attribute_value.fkAttribute', equals: 'attribute.id' },
    ]

    const result = await $table.findPaginated(query, options)

    result.items = await $format.fillMany(result.items)

    return result
    // let items, pagination

    // const result = await $table.findPaginated(query, options)

    // items = await $format.fillMany(result.items)
    // pagination = result.pagination

    // return {
    //   items,
    //   pagination,
    // }
  },

  async findMany(query = {}, options = {}) {

    options.join = [
      { type: 'left', table: 'category', on: 'article.fkCategory', equals: 'category.id' },
      { type: 'left', table: 'section', on: 'category.fkSection', equals: 'section.id' },
      { type: 'left', table: 'nn_article_attribute_value', on: 'article.id', equals: 'nn_article_attribute_value.fkArticle' },
      { type: 'left', table: 'attribute_value', on: 'nn_article_attribute_value.fkAttributeValue', equals: 'attribute_value.id' },
      { type: 'left', table: 'attribute', on: 'attribute_value.fkAttribute', equals: 'attribute.id' },
    ]

    const rows = await $table.findMany(query, options)
    const items = await $format.fillMany(rows)
    return items
  },

  async findOne(query = {}, options = {}) {

    options.join = [
      { type: 'left', table: 'category', on: 'article.fkCategory', equals: 'category.id' },
      { type: 'left', table: 'section', on: 'category.fkSection', equals: 'section.id' },
      { type: 'left', table: 'nn_article_attribute_value', on: 'article.id', equals: 'nn_article_attribute_value.fkArticle' },
      { type: 'left', table: 'attribute_value', on: 'nn_article_attribute_value.fkAttributeValue', equals: 'attribute_value.id' },
      { type: 'left', table: 'attribute', on: 'attribute_value.fkAttribute', equals: 'attribute.id' },
    ]

    const rows = await $table.findMany(query, options)
    const items = await $format.fillMany(rows)

    return items[0]
  },

  async insertOne({ images, attributes, ...item }) {
    let id

    $schema.validateOne(item)

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

    await $attributes.removeMany({ fkArticle: id })
    result = await $table.removeOne({ id })
    await $images.removeMany({ fkArticle: id })

    return result
  },

})
