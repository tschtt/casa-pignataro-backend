
export default ({ $table, $images }) => ({

  async insertOne({ images, ...item }) {
    let id

    id = await $table.insertOne(item)

    if (images) {
      await $images.insertMany(images, { fkArticle: id })
    }

    return id
  },

  async insertMany(items = []) {
    let result
    result = items.map((item) => this.insertOne(item))
    result = await Promise.all(result)
    return result
  },

})
