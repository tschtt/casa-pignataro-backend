
export default ({ $table, $schema, $format }) => ({

  async findMany(query, options) {
    let items
    items = await $table.findMany(query, options)
    items = await $format.fillMany(items)
    return items
  },

})
