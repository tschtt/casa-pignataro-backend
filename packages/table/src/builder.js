/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import { TypeNotSupportedError } from './errors.js'

export default ({ format }) => function build(expression, { isNot = false, joint = ' ' } = {}) {
  const state = {
    sql: [],
    values: [],
    add(sql, values = []) {
      state.sql.push(sql)
      state.values.push(...values)
    },
  }

  const operators = {

    // Main operations
    $select({ from, as, table, only, count, count_as, min, max }) {
      let sql
      let values

      if (typeof count === 'boolean') {
        count = 'id'
      }

      if (from && as) {
        from = build(from)
        sql = `SELECT * FROM (${from}) AS ??`
        values = [as]

        if (count) {
          sql = `SELECT COUNT(??) FROM (${from}) AS ??`
          values = [count, as]
          if (count_as) {
            sql = `SELECT COUNT(??) ?? FROM (${from}) AS ??`
            values = [count, count_as, as]
          }
        }
        if (only) {
          sql = `SELECT ?? FROM (${from}) AS ??`
          values = [only, as]
        }
        if (only && count) {
          sql = `SELECT ??, COUNT(??) FROM (${from}) AS ??`
          values = [only, count, as]
          if (count_as) {
            sql = `SELECT ??, COUNT(??) ?? FROM (${from}) AS ??`
            values = [only, count, count_as, as]
          }
        }
      }

      if (table) {
        sql = 'SELECT * FROM ??'
        values = [table]

        if (count) {
          sql = 'SELECT COUNT(??) FROM ??'
          values = [count, table]
          if (count_as) {
            sql = 'SELECT COUNT(??) ?? FROM ??'
            values = [count, count_as, table]
          }
        }
        if (only) {
          sql = 'SELECT ?? FROM ??'
          values = [only, table]
        }
        if (only && count) {
          sql = 'SELECT ??, COUNT(??) FROM ??'
          values = [only, count, table]

          if (count_as) {
            sql = 'SELECT ??, COUNT(??) ?? FROM ??'
            values = [only, count, count_as, table]
          }
        }
        if (min) {
          sql = 'SELECT MIN(??) FROM ??'
          values = [min, table]
          if (max) {
            sql = 'SELECT MIN(??), MAX(??) FROM ??'
            values = [min, max, table]
          }
        }
        if (max) {
          sql = 'SELECT MAX(??) FROM ??'
          values = [max, table]
          if (min) {
            sql = 'SELECT MAX(??), MIN(??) FROM ??'
            values = [max, min, table]
          }
        }
      }

      state.add(sql, values)
    },
    $insert({ table, value, values }) {
      if (values) {
        state.add('INSERT INTO ?? (??) VALUES ?', [
          table,
          Object.keys(values[0]),
          values.map((value) => Object.values(value)),
        ])
      } else if (value) {
        state.add('INSERT INTO ?? (??) VALUES (?)', [
          table,
          Object.keys(value),
          Object.values(value),
        ])
      }
    },
    $update({ table, set }) {
      state.add('UPDATE ?? SET ?', [table, set])
    },
    $delete({ table }) {
      state.add('DELETE FROM ??', [table])
    },

    // Join
    $join(value) {
      const parse_object = ({ type, table, on, equals }) => {
        const parse_type = (value = '') => {
          switch (value.toLowerCase()) {
            case 'inner': return 'INNER'
            case 'left':  return 'LEFT'
            case 'right': return 'RIGHT'
            case 'cross': return 'CROSS'
            default: return 'INNER'
          }
        }

        state.add(`${parse_type(type)} JOIN ?? ON ?? = ??`, [table, on, equals])
      }

      const parse_array = (joins = []) => {
        joins.forEach(parse_object)
      }

      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          parse_array(value)
        } else {
          parse_object(value)
        }

      }
    },

    // Filter operations
    $where(expression = {}) {
      const result = build(expression, { joint: ' AND ' })
      if (result) {
        state.add(`WHERE ${result}`)
      }
    },
    // Comparison
    $like: ({ field, value }) => {
      value = `%${value}%`

      return isNot
        ? state.add('?? NOT LIKE ?', [field, value])
        : state.add('?? LIKE ?', [field, value])
    },
    $eq: ({ field, value }) => (isNot
      ? state.add('?? NOT LIKE ?', [field, value])
      : state.add('?? LIKE ?', [field, value])),
    $gt: ({ field, value }) => (isNot
      ? state.add('?? <= ?', [field, value])
      : state.add('?? > ?', [field, value])),
    $gte: ({ field, value }) => (isNot
      ? state.add('?? < ?', [field, value])
      : state.add('?? >= ?', [field, value])),
    $in: ({ field, value }) => {
      if (typeof value[0] === 'object') {
        value = value.map((v) => v[field])
        value = value.filter((v) => v !== null && v !== undefined)
      }
      return isNot
        ? state.add('?? NOT IN (?)', [field, value])
        : state.add('?? IN (?)', [field, value])
    },
    $nin: ({ field, value }) => {
      if (!value || !value.length) {
        return
      }
      if (typeof value[0] === 'object') {
        value = value.map((v) => v[field])
        value = value.filter((v) => v !== null && v !== undefined)
      }
      return isNot
        ? state.add('?? IN (?)', [field, value])
        : state.add('?? NOT IN (?)', [field, value])
    },
    $lt: ({ field, value }) => (isNot
      ? state.add('?? >= ?', [field, value])
      : state.add('?? < ?', [field, value])),
    $lte: ({ field, value }) => (isNot
      ? state.add('?? > ?', [field, value])
      : state.add('?? <= ?', [field, value])),
    $ne: ({ field, value }) => (isNot
      ? state.add('?? LIKE ?', [field, value])
      : state.add('?? NOT LIKE ?', [field, value])),
    // Logical
    $not: ({ field, value }) => {
      const result = build({ [field]: value }, { isNot: !isNot })
      state.add(result)
    },
    $and: (expressions = []) => {
      const block = expressions.map((expression) => build(expression)).join(') AND (')
      state.add(`(${block})`)
    },
    $or: (expressions = []) => {
      const block = expressions.map((expression) => build(expression)).join(') OR (')
      state.add(`((${block}))`)
    },
    $nor: (expressions = []) => {
      const block = expressions.map((expression) => build(expression, { isNot: true })).join(') OR (')
      state.add(`(${block})`)
    },
    $nand: (expressions = []) => {
      const block = expressions.map((expression) => build(expression, { isNot: true })).join(') AND (')
      state.add(`(${block})`)
    },

    // Limiting and sorting operations
    $limit({ amount, offset }) {
      if (amount) {
        state.add('LIMIT ?', [amount])
        if (offset) {
          state.add('OFFSET ?', [offset])
        }
      }
    },
    $order({ by, sort }) {
      if (by) {
        state.add('ORDER BY ??', [by])
        if (sort) {
          if (sort.toLowerCase() === 'asc') {
            state.add('ASC')
          }
          if (sort.toLowerCase() === 'desc') {
            state.add('DESC')
          }
        }
      }
    },
    $group(by) {
      state.add('GROUP BY ??', [by])
    },
  }

  const parse = (expression) => {
    const operations = []
    for (const name in expression) {
      // if it's an operator like $select, $where, $limit, $and, etc
      // all that dont operate on a specific column
      if (operators[name]) {
        // add its value as a prop to the operator
        const props = expression[name]
        operations.push({ operator: name, props })
      }
      // if its not, its an operation on a colum
      // like id: { $gt: 1, $lt: 10 }, id: 1, etc
      else {
        const operators = expression[name]
        switch (typeof operators) {
          case 'string':
          case 'number':
          case 'boolean':
            operations.push({ operator: '$eq', props: { field: name, value: operators } })
            break
          case 'object':
            if (Array.isArray(operators)) {
              operations.push({ operator: '$in', props: { field: name, value: operators } })
            } else {
              // loop over every operation over the column
              for (const operator in operators) {
                if (Object.hasOwnProperty.call(operators, operator)) {
                  const value = operators[operator]
                  // and add its name and its value as a prop to the operator
                  operations.push({ operator, props: { field: name, value } })
                }
              }
            }
            break
          case 'undefined':
            operations.push({ operator: '$eq', props: { field: name, value: null } })
            break
          default:
            throw new TypeNotSupportedError()
        }
      }
    }

    return operations
  }

  const run = (operations) => {
    for (const operation of operations) {
      operators[operation.operator](operation.props)
    }

    const sql = state.sql.join(joint)
    const { values } = state

    return format(sql, values)
  }

  const operations = parse(expression)
  const query = run(operations)

  return query
}
