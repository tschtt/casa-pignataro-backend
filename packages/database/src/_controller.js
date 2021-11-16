import { format } from "mysql2"

const builder = {
  operators: {
    $eq: (column, value) => {
      return format('?? like ?', [column, value])
    }
  },
  build(query = {}) {
    const operations = []
    
    for (const column in query) {
      const operators = query[column]
      for (const operator in operators) {
        const value = operators[operator]
        operations.push({ column, operator, value })
      }
    }

    let result = []

    for (const operation of operations) {
      const { column, operator, value } = operation
      const sql = this.operators[operator](column, value)
      result.push(sql)
    }
    
    result = result.join(' AND ')

    if(result)
      return 'WHERE ' + result
  },
}

export default ({ database }) => (name) => ({
  async findMany(query = {}, options) {
    let sql = ['SELECT * FROM ??']
    query = builder.build(query)

    if(query) {
      sql.push(query)
    }

    sql = sql.join(' ')

    const result = await database.query(sql, [name])
    return result[0]
  },

  async findOne() {
    const result = await database.query('SELECT * FROM ?? LIMIT 1', [name])
    return result[0][0]
  },
  
})