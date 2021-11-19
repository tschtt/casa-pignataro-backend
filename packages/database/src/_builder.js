import { format } from "mysql2"

export default function build(query = {}, { isNot = false } = {}) {
  const operatorFunctions = {
    $eq: ({ column, value }) => {
      return isNot 
        ? format('?? NOT LIKE ?', [column, value])
        : format('?? LIKE ?', [column, value])
    },
    $gt: ({ column, value }) => {
      return isNot
        ? format('?? <= ?', [column, value])
        : format('?? > ?', [column, value])
    },
    $gte: ({ column, value }) => {
      return isNot
        ? format('?? < ?', [column, value])
        : format('?? >= ?', [column, value])
    },
    $in: ({ column, value }) => {
      return isNot 
        ? format('?? NOT IN (?)', [column, value])
        : format('?? IN (?)', [column, value])
    },
    $lt: ({ column, value }) => {
      return isNot
        ? format('?? >= ?', [column, value])
        : format('?? < ?', [column, value])
    },
    $lte: ({ column, value }) => {
      return isNot
        ? format('?? > ?', [column, value])
        : format('?? <= ?', [column, value])
    },
    $ne: ({ column, value }) => {
      return isNot
        ? format('?? LIKE ?', [column, value])
        : format('?? NOT LIKE ?', [column, value])
    },
    $nin: ({ column, value }) => {
      return isNot
        ? format('?? IN (?)', [column, value])
        : format('?? NOT IN (?)', [column, value])
    },
    $not: ({ column, value }) => {
      return build({ [column]: value }, { isNot: true })
    },
    $and: ({ expressions = [] }) => {
      const block = expressions.map(expression => build(expression)).join(') AND (')
      return `(${block})`
    },
    $or: ({ expressions = [] }) => {
      const block = expressions.map(expression => build(expression)).join(') OR (')
      return `(${block})`
    },
    $nor: ({ expressions = [] }) => {
      const block = expressions.map(expression => build(expression, { isNot: true })).join(') OR (')
      return `(${block})`
    },
    $nand: ({ expressions = [] }) => {
      const block = expressions.map(expression => build(expression, { isNot: true })).join(') AND (')
      return `(${block})`
    }
  }
  
  const operations = []
  
  for (const propertie in query) {
    const operators = query[propertie]

    if(operatorFunctions[propertie]) {
      operations.push({ expressions: operators, operator: propertie })
    } else {
      for (const operator in operators) {
        const value = operators[operator]
        operations.push({ column: propertie, operator, value })
      }
    }
    
  }

  let result = []

  for (const operation of operations) {
    const sql = operatorFunctions[operation.operator](operation)
    result.push(sql)
  }
  
  result = result.join(' AND ')

  return result
}