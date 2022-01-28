/* eslint-disable default-param-last */

export default ({ resource }) => ({

  async findMany(request) {
    const items = await resource.findMany()
    return items
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    const item = await resource.findOne({ id })
    return item
  },

  async insertOne(request) {
    const data = request.body
    const id = await resource.insertOne(data)
    return resource.findOne({ id })
  },

  async updateOne(request) {
    const id = parseInt(request.params.id)
    const data = request.body
    await resource.updateOne({ id, ...data })
    return resource.findOne({ id })
  },

  async removeOne(request) {
    return resource.removeOne({ id: request.params.id })
  },

})
