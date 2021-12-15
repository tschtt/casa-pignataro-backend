/* eslint-disable default-param-last */

export default ({ table }) => ({

  async findMany(request) {
    const items = await table.findMany()

    if (request.query.flat !== undefined) {
      const format = (items = [], fkCategorie = 0, path) => {
        const levelItems = items.filter((item) => item.fkCategorie === fkCategorie)
        levelItems.forEach((item) => {
          // const index = items.findIndex((i) => i.id === item.id)

          item.full = path
            ? [path, item.name].join(' / ')
            : item.name

          item.categories = format(items, item.id, item.full)

          delete item.fkCategorie

          // items[index] = { ...item }
        })
      }
      format(items)

      return items
    }

    const format = (items = [], fkCategorie = 0, path) => {
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

  async findOne(request) {
    const item = await table.findOne({ id: request.params.id })
    if (item) {
      item.categories = await table.findMany({ fkCategorie: request.params.id })
    }
    return item || {}
  },

  async insertOne(request) {
    const data = request.body
    delete data.categories
    const id = await table.insertOne(data)
    return table.findOne({ id })
  },

  async updateOne(request) {
    const id = parseInt(request.params.id)
    const data = request.body
    delete data.categories
    await table.updateOne({ id }, data)
    return table.findOne({ id })
  },

  async removeOne(request) {
    return table.removeOne({ id: request.params.id })
  },

})
