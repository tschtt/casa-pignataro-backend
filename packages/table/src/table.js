
export default ({ connection, builder: build }) => (table) => ({
  
  async query(expression = {}) {
    const sql = build(expression)
    const result = await connection.query(sql)
    return result[0]
  },
  
  async findMany(expression = {}, { only, limit: amount, offset, orderBy: by, order: sort } = {}) {
    const result = await this.query({
      $select: { table, only },
      $where: expression,
      $order: { by, sort },
      $limit: { amount, offset },
    })

    return result
  },

  async findOne(expression = {}, { only, offset, orderBy: by, order: sort } = {}) {
    const result = await this.query({
      $select: { table, only },
      $where: expression,
      $order: { by, sort },
      $limit: { amount: 1, offset },
    })

    return result[0]
  },
  
})