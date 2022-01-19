export default ({ $table }) => ({

  async findMany(query, { flat } = {}) {
    const items = await $table.findMany(query)

    if (flat === true) {

      const format = (items = [], fkCategorie = 0, { path, pathId } = {}) => {
        const levelItems = items.filter((item) => item.fkCategorie === fkCategorie)
        levelItems.forEach((item) => {
          item.full = path ? [path, item.name].join(' / ') : item.name
          item.fullId = path ? [...pathId, item.id] : [item.id]
          item.categories = format(items, item.id, { path: item.full, pathId: item.fullId })
          delete item.fkCategorie
        })
      }

      format(items)

      return items
    }

    const format = (items = [], fkCategorie = 0, path = undefined) => {
      const levelItems = items.filter((item) => item.fkCategorie === fkCategorie)

      return levelItems.map((item) => {
        item.full = path
          ? [path, item.name].join(' / ')
          : item.name

        item.categories = format(items, item.id, item.full)

        delete item.fkCategorie

        return item
      })
    }

    return format(items)
  },

  async findOne({ id }) {
    const item = await $table.findOne({ id })
    if (item) {
      item.categories = await $table.findMany({ fkCategorie: id })
    }
    return item || {}
  },

  async insertOne({ categories, ...item }) {
    let id

    id = await $table.insertOne(item)

    if (categories) {
      await this.insertMany(categories, { fkCategorie: id })
    }

    return id
  },

  async insertMany(items = [], global = {}) {
    let result
    result = items.map((item) => this.insertOne({ ...item, ...global }))
    result = await Promise.all(result)
    return result
  },

  async updateOne({ id, ...item }) {
    delete item.categories
    delete item.full
    return $table.updateOne({ id }, item)
  },

  async removeOne({ id }) {
    return $table.removeOne({ id })
  },

})
