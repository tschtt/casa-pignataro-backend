
export default ({ database, builder: build }) => (table) => ({
  
  async query(expression = {}) {
    const sql = build(expression)
    const result = await database.query(sql)
    return result[0]
  },
  
  async findMany(expression = {}, { only, limit, offset, orderBy, order } = {}) {
    const result = await this.query({
      $select: { table, only },
      $where: { expression },
      $order: {orderBy, order },
      $limit: { limit, offset },
    })

    return result
  },

  async findOne(expression = {}, { only, offset, orderBy, order } = {}) {
    const result = await this.query({
      $select: { table, only },
      $where: { expression },
      $limit: { limit: 1, offset },
      $order: {orderBy, order }
    })

    return result[0]
  },
  
})