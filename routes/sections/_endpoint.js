/* eslint-disable default-param-last */

function parseBoolean(value) {
  if (['false', 'FALSE', '0'].includes(value)) return false
  if (['true', 'TRUE', '1'].includes(value)) return true
  return undefined
}

export default ({ resource }) => ({

  async findMany(request) {
    const query = {}

    if (request.query.active) {
      query['section.active'] = parseBoolean(request.query.active)
    }

    const items = await resource.findMany(query)
    return items
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    const item = await resource.findOne({ 'section.id': id })
    return item
  },

  async insertOne(request) {
    const data = request.body
    const id = await resource.insertOne(data)
    return resource.findOne({ 'section.id': id })
  },

  async updateOne(request) {
    const id = parseInt(request.params.id)
    const data = request.body
    await resource.updateOne({ id, ...data })
    return resource.findOne({ 'section.id': id })
  },

  async removeOne(request) {
    return resource.removeOne({ id: request.params.id })
  },

})
