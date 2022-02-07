
export default ({ $table, $attributes, $values, $schema, $format }) => ({

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

  async insertOne({ fkArticle, fkCategory, name, value } = {}) {
    // validate the data
    $schema.validateOne({ fkArticle, fkCategory, name, value })

    // find or create the attribute row
    let { id: fkAttribute } = await $attributes.findOne({ name, fkCategory }) || {}

    if (!fkAttribute) {
      fkAttribute = await $attributes.insertOne({ name, fkCategory })
    }

    // find or create the attribute_value row
    let { id: fkAttributeValue } = await $values.findOne({ name: value, fkAttribute }) || {}
    if (!fkAttributeValue) {
      fkAttributeValue = await $values.insertOne({ name: value, fkAttribute })
    }

    // create the nn_article_attribute_value row
    const id = await $table.insertOne({ fkArticle, fkAttributeValue  })

    // returns its id
    return id
  },

  async insertMany(items = [], globals = {}) {
    const result = []

    items = items.map((item) => ({ ...item, ...globals }))

    for await (const item of items) {
      const resultItem = await this.insertOne(item)
      result.push(resultItem)
    }

    return items
  },

  // async updateOne({ fkArticle, fkCategory, name, value } = {}) {
  //   const fkAttribute = await $attributes.upsertOne({ id: attribute.id, fkCategory }, { ...attribute, fkCategory })
  //   const fkAttributeValue = await $values.upsertOne({ id: value.id, fkAttribute }, { ...value, fkAttribute })
  //   const count = await $table.updateOne({ id, fkArticle, fkAttributeValue  })
  //   return count
  // },

  // async updateMany(items = [], globals = {}) {
  //   items = items.map((item) => ({ ...item, ...globals }))
  //   items = items.map((item) => this.updateOne(item))
  //   items = await Promise.all(items)
  //   return items
  // },

  async removeMany(query) {
    return $table.removeMany(query)
  },

})
