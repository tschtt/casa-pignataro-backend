
export default ({ table }) => ({

  findMany() {
    return table.findMany()
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

})
