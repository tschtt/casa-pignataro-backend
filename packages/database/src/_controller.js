import build from './_builder.js'

export default ({ database }) => (name) => ({
  
  async findMany(query = {}, options) {
    let sql = ['SELECT * FROM ??']
    query = build(query)

    if(query) {
      sql.push('WHERE', query)
    }

    sql = sql.join(' ')

    const result = await database.query(sql, [name])
    return result[0]
  },

  async findOne(query = {}) {
    let sql = ['SELECT * FROM ??']
    query = build(query)

    if(query) {
      sql.push('WHERE', query)
    }

    sql.push('LIMIT 1')

    sql = sql.join(' ')

    const result = await database.query(sql, [name])
    return result[0][0]
  },
  
})