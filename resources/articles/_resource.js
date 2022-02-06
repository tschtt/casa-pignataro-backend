
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

    result.items = await $format(result.items)

    return result
  },

  async findFaceted(query = {}, options = {}) {
    options.join = [
      { type: 'left', table: 'category', on: 'article.fkCategory', equals: 'category.id' },
      { type: 'left', table: 'section', on: 'category.fkSection', equals: 'section.id' },
      { type: 'left', table: 'nn_article_attribute_value', on: 'article.id', equals: 'nn_article_attribute_value.fkArticle' },
      { type: 'left', table: 'attribute_value', on: 'nn_article_attribute_value.fkAttributeValue', equals: 'attribute_value.id' },
      { type: 'left', table: 'attribute', on: 'attribute_value.fkAttribute', equals: 'attribute.id' },
    ]

    options.only = [
      'article.id',
      'article.name',
      'article.value',
      'article.shortDescription',
    ]

    // results

    const { items: rows, pagination } = await $table.findPaginated(query, options)

    const items = $format(rows)

    // filters

    const filters = {}

    // filters: value

    const rows_values = await $table.query({
      $select: {
        table: 'article',
        max: 'value',
        min: 'value',
      },
      $join: options.join,
      $where: query,
    })

    filters.minValue = rows_values[0]['']['MIN(`value`)']
    filters.maxValue = rows_values[0]['']['MAX(`value`)']

    // filters: sections

    const rows_sections = await $table.query({
      $select: {
        table: 'article',
        only: [
          'section.id',
          'section.name',
        ],
        count: 'article.id',
        count_as: 'count',
      },
      $join: options.join,
      $where: query,
      $group: 'section.id',
    })

    const sections = rows_sections.map(row => ({ ...row.section, ...row[''] }))

    if (sections.length > 1) {
      filters.sections = sections
    } else {
      const rows_categories = await $table.query({
        $select: {
          table: 'article',
          only: [
            'category.id',
            'category.name',
          ],
          count: 'article.id',
          count_as: 'count',
        },
        $join: options.join,
        $where: query,
        $group: 'category.id',
      })

      const categories = rows_categories.map(row => ({ ...row.category, ...row[''] }))

      if (categories.length > 1) {
        filters.categories = categories
      } else {
        const rows_attributes = await $table.query({
          $select: {
            table: 'article',
            only: [
              'attribute.id',
              'attribute.name',
              'attribute_value.id',
              'attribute_value.name',
            ],
            count: 'article.id',
            count_as: 'count',
          },
          $join: options.join,
          $where: query,
          $group: 'attribute_value.id',
        })

        filters.attributes = []

        for (const row of rows_attributes) {
          let attribute = filters.attributes.find(a => a.id === row.attribute.id)
          if (!attribute) {
            attribute = {}
            attribute.id = row.attribute.id
            attribute.name = row.attribute.name
            attribute.options = []
            attribute.options.push({
              id: row.attribute_value.id,
              name: row.attribute_value.name,
            })
            filters.attributes.push(attribute)
          } else {
            attribute.options.push({
              id: row.attribute_value.id,
              name: row.attribute_value.name,
              count: row[''].count,
            })
          }
        }
      }
    }

    return {
      items,
      filters,
      pagination,
    }
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
    const items = await $format(rows)

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
    const items = await $format(rows)

    return items[0] || {}
  },

  async insertOne({ images, attributes, category, ...item }) {
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
