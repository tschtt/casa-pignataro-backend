/* eslint-disable default-param-last */

function parseBoolean(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  return false
}

export default ({ table, $categories }) => ({

  async findMany(request) {
    const flat = parseBoolean(request.query.flat)
    const items = await $categories.findMany({}, { flat })
    return items
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    const item = await $categories.findOne({ id })
    return item
  },

  async insertOne(request) {
    const data = request.body
    const id = await table.insertOne(data)
    return $categories.findOne({ id })
  },

  async updateOne(request) {
    const id = parseInt(request.params.id)
    const data = request.body
    await $categories.updateOne({ id, ...data })
    return $categories.findOne({ id })
  },

  async removeOne(request) {
    return $categories.removeOne({ id: request.params.id })
  },

})
