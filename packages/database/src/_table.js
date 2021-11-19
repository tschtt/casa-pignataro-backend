import { format } from 'mysql2'
import build from './_builder.js'

export default ({ database }) => (name) => ({
  
  async findMany(query = {}, { only, limit, offset, orderBy, order } = {}) {
    let sql = []
    let values = []
    
    if(only) {
      sql.push('SELECT ?? FROM ??')
      values.push(only, name)
    } else {
      sql.push('SELECT * FROM ??')
      values.push(name)
    }
    
    query = build.where(query)

    if(query) {
      sql.push('WHERE', query)
    }

    if(orderBy) {
      sql.push('ORDER BY ?')
      values.push(orderBy)

      if(order) {
        if(order.toLowerCase() === 'asc') {
          sql.push('ASC')
        }
        if(order.toLowerCase() === 'desc') {
          sql.push('DESC')
        }
      }
    }

    if(limit) {
      sql.push('LIMIT ?')
      values.push(limit)

      if(offset) {
        sql.push('OFFSET ?')
        values.push(offset)
      }      
    }

    sql = sql.join(' ')

    const result = await database.query(sql, values)
    
    return result[0]
  },

  async findOne(query = {}, options = {}) {
    const result = await this.findMany(query, { ...options, limit: 1})
    return result[0]
  },
  
})