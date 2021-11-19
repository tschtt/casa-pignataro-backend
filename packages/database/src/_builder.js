
export default ({ format }) => {
  return function build(expression, { isNot = false, joint = ' '} = {}) {
    const state = {
      sql: [],
      values: [],
      add(sql, values = []) {
        state.sql.push(sql)
        state.values.push(...values) 
      },
    }
    
    const operators = {
      $select({ table, only }) {
        if(only) {
          state.add('SELECT ?? FROM ??', [only, table])
        } else {
          state.add('SELECT * FROM ??', [table])
        }
      },
      $where({ expression }) {
        const result = build(expression, { joint: ' AND ' })
        if(result) {
          state.add('WHERE ' + result)
        }      
      },
      $limit({ limit, offset }) {
        if(limit) {
          state.add('LIMIT ?', [limit])
          if(offset) {
            state.add('OFFSET ?', [offset])
          }      
        }
      },
      $order({ orderBy, order }) {
        if(orderBy) {
          state.add('ORDER BY ?', [orderBy])
          if(order) {
            if(order.toLowerCase() === 'asc') {
              state.add('ASC')
            }
            if(order.toLowerCase() === 'desc') {
              state.add('DESC')
            }
          }
        }
      },
      $eq: ({ field, value }) => {
        return isNot 
          ? state.add('?? NOT LIKE ?', [field, value])
          : state.add('?? LIKE ?', [field, value])
      },
      $gt: ({ field, value }) => {
        return isNot
          ? state.add('?? <= ?', [field, value])
          : state.add('?? > ?', [field, value])
      },
      $gte: ({ field, value }) => {
        return isNot
          ? state.add('?? < ?', [field, value])
          : state.add('?? >= ?', [field, value])
      },
      $in: ({ field, value }) => {
        return isNot 
          ? state.add('?? NOT IN (?)', [field, value])
          : state.add('?? IN (?)', [field, value])
      },
      $lt: ({ field, value }) => {
        return isNot
          ? state.add('?? >= ?', [field, value])
          : state.add('?? < ?', [field, value])
      },
      $lte: ({ field, value }) => {
        return isNot
          ? state.add('?? > ?', [field, value])
          : state.add('?? <= ?', [field, value])
      },
      $ne: ({ field, value }) => {
        return isNot
          ? state.add('?? LIKE ?', [field, value])
          : state.add('?? NOT LIKE ?', [field, value])
      },
      $nin: ({ field, value }) => {
        return isNot
          ? state.add('?? IN (?)', [field, value])
          : state.add('?? NOT IN (?)', [field, value])
      },
      $not: ({ field, value }) => {
        const result = build({ [field]: value }, { isNot: !isNot })
        state.add(result)
      },
      $and: ({ expressions = [] }) => {
        const block = expressions.map(expression => build(expression)).join(') AND (')
        state.add(`(${block})`)
      },
      $or: ({ expressions = [] }) => {
        const block = expressions.map(expression => build(expression)).join(') OR (')
        state.add(`(${block})`)
      },
      $nor: ({ expressions = [] }) => {
        const block = expressions.map(expression => build(expression, { isNot: true })).join(') OR (')
        state.add(`(${block})`)
      },
      $nand: ({ expressions = [] }) => {
        const block = expressions.map(expression => build(expression, { isNot: true })).join(') AND (')
        state.add(`(${block})`)
      }
    }
  
    const parse = (expression) => {
      const operations = []
          
      for (const name in expression) {
        if(operators[name]) {
          const props = expression[name]
          operations.push({ expressions: props, ...props, operator: name })
        } else {
          const operators = expression[name]
          for (const operator in operators) {
            const value = operators[operator]
            operations.push({ field: name, operator, value })
          }
        }
        
      }
  
      return operations
    }
  
    const run = (operations) => {
      for (const operation of operations) {
        operators[operation.operator](operation)
      }
  
      const sql = state.sql.join(joint)
      const values = state.values
      return format(sql, values)
    }
  
    const operations = parse(expression)
    const query = run(operations)
  
    return query
  }
}