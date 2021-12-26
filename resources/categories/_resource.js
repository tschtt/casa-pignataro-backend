export default ({ $table }) => ({

  async findMany(query, { flat } = {}) {
    const items = await $table.findMany()

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

  async insertOne(item) {
    delete item.categories
    return $table.insertOne(item)
  },

  async updateOne({ id, ...item }) {
    delete item.categories
    return $table.updateOne({ id }, item)
  },

  async removeOne({ id }) {
    return $table.removeOne({ id })
  },

})
