
function parseQuery({ only, orderBy, order, limit, offset, ...query }) {
  if (limit) {
    limit = parseInt(limit)
  }

  if (offset) {
    offset = parseInt(offset)
  }

  if (only) {
    only = only.replace(/\s/g, '').split(',')
  }

  return {
    query,
    options: {
      only,
      orderBy,
      order,
      limit,
      offset,
    },
  }
}

export default ({ controller }) => ({

  async findMany(request) {
    const { query, options } = parseQuery(request.query)
    const items = await controller.findMany(query, options)

    return {
      success: true,
      items,
    }
  },

  async findOne(request) {
    const { query, options } = parseQuery(request.query)

    query.id = parseInt(request.params.id)

    const item = await controller.findOne(query, options)

    return {
      success: true,
      item,
    }
  },

  async upsertOne(request) {
    const data = request.body

    data.id = parseInt(request.params.id) || 0

    delete data.password

    const id = await controller.upsertOne(data)

    const item = await controller.findOne({ id })

    return {
      success: true,
      item,
    }
  },

  async removeOne(request) {
    const { query, options } = parseQuery(request.query)

    query.id = parseInt(request.params.id)

    const removed = await controller.removeOne(query, options)

    return {
      success: true,
      removed,
    }
  },

})
