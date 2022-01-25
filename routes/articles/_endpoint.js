
function parseBoolean(value) {
  if (value === 'true' || value === 1) return true
  if (value === 'false' || value === 0) return false
  return value
}

export default ({ table, $images, $categories }) => ({

  async findMany(request) {
    let { paginate, page, orderBy, sort, limit, offset, ...query } = request.query

    if (paginate) {
      paginate = parseBoolean(paginate)
    }
    if (page) {
      page = parseInt(page)
    }
    if (limit) {
      limit = parseInt(limit)
    }

    let { search, fkCategorie, active } = query

    query = {}

    if (active) {
      query.active = parseBoolean(active)
    }
    if (fkCategorie) {
      const fkCategorie = parseInt(fkCategorie)
      const categories = await $categories.findMany({}, { flat: true })
      const categorieTree = categories.filter((categorie) => categorie.fullId.includes(fkCategorie))
      const fkCategories = categorieTree.map((categorie) => categorie.id)

      query.fkCategorie = { $in: fkCategories }
    }
    if (search) {
      query.$or = [
        { code: search },
        { name: { $like: search } },
        { description: { $like: search } },
        { shortDescription: { $like: search } },
      ]
    }
    if (paginate) {

      const result = await table.findPaginated(query, { page, orderBy, sort })

      result.items = result.items.map((item) => {
        item.images = $images.findMany(`articles/${item.id}`)
        return item
      })

      return result
    }

    let items
    let count

    items = await table.findMany(query, { limit, offset, orderBy, sort })
    count = await table.count(query)

    items = items.map((item) => {
      item.images = $images.findMany(`articles/${item.id}`)
      return item
    })

    return {
      items,
      count,
    }
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    const item = await table.findOne({ id })

    if (item) {
      item.images = $images.findMany(`articles/${id}`)
    }

    return item || {}
  },

  async insertOne(request) {
    const data = request.body

    const id = await table.insertOne(data)

    $images.insertMany(`articles/${id}`, request.files)

    return table.findOne({ id })
  },

  async updateOne(request) {
    const id = parseInt(request.params.id)
    const data = request.body

    let images = data.images || []

    images = images.map((image) => {
      return image.split('/').pop()
    })

    delete data.images

    await table.updateOne({ id }, data)

    $images.removeNotIn(`articles/${id}`, images)
    $images.insertMany(`articles/${id}`, request.files)

    return table.findOne({ id })
  },

  async removeOne(request) {
    const id = request.params.id
    const result = await table.removeOne({ id })
    $images.removeMany(`articles/${id}`)
    return result
  },

})
