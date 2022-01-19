
export default ({ table }) => ({

  findMany(request) {
    return table.findMany(request.query)
  },

  async findOne(request) {
    const item = await table.findOne({ id: parseInt(request.params.id) })
    return item || {}
  },

  async insertOne(request) {
    const data = request.body
    const id = await table.insertOne(data)
    return table.findOne({ id })
  },

  async updateOne(request) {
    const id = parseInt(request.params.id)
    const data = request.body
    await table.updateOne({ id }, data)
    return table.findOne({ id })
  },

  async removeOne(request) {
    return table.removeOne({ id: request.params.id })
  },

})
