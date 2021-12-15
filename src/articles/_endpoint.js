
export default ({ table, images: $images }) => ({

  async findMany() {
    let items
    items = await table.findMany()
    return items
  },

  async findOne(request) {
    const id = request.params.id
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
