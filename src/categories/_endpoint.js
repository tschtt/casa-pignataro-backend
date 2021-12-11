
export default ({ table }) => ({

  async findMany() {
    const items = await table.findMany()

    const parse = (items = [], fkCategorie = 0) => {
      const levelItems = items.filter((item) => item.fkCategorie === fkCategorie)
      return levelItems.map((item) => {
        item.categories = parse(items, item.id)
        delete item.fkCategorie
        return item
      })
    }

    return parse(items)
  },

  async findOne(request) {
    const item = await table.findOne({ id: request.params.id })
    if (item) {
      item.categories = await table.findMany({ fkCategorie: request.params.id })
    }
    return item
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
