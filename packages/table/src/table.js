
const PAGE_SIZE = parseInt(process.env.DATABASE_PAGE_SIZE)

export default ({ connection, builder: build }) => (table) => ({

  async query(query = {}) {
    const sql = build(query)
    console.log(sql)
    const result = query.$join || query.$join_active
      ? await connection.query({ sql, nestTables: true })
      : await connection.query(sql)
    return result[0]
  },

  async count(query, options) {
    const result = await this.query({
      $select: {
        from: {
          $select: { table, only: [`${table}.id`] },
          $join: options.join,
          $where: query,
          $group: `${table}.id`,
        },
        as: 't',
        count: true,
      },
    })

    return result[0]['COUNT(`id`)']
  },

  async findPaginated(query = {}, options = {}) {

    options.page = options.page || 1

    const count = await this.count(query, options)

    let items

    if (options.join) {
      items = await this.query({
        $select: {
          from: {
            $select: { table, only: [`${table}.id`] },
            $join: options.join,
            $where: query,
            $group: `${table}.id`,
            $order: {
              by: options.orderBy,
              sort: options.sort,
              by_2: `${table}.id`,
            },
            $limit: {
              amount: PAGE_SIZE,
              offset: PAGE_SIZE * (options.page - 1),
            },
          },
          only: options.only,
          as: 'table',
        },
        $join: [
          { type: 'left', table, on: 'table.id', equals: `${table}.id` },
          ...options.join || [],
        ],
      })
    }
    else {
      items = await this.query({
        $select: {
          table,
          only: options.only,
        },
        $join: options.join,
        $where: query,
        $order: {
          by: options.orderBy,
          sort: options.sort,
          by_2: `${table}.id`,
        },
        $limit: {
          amount: PAGE_SIZE,
          offset: PAGE_SIZE * (options.page - 1),
        },
      })
    }

    items = items.map(item => {
      delete item.table
      return item
    })

    return {
      items,
      pagination: {
        item_count: count,
        page_first: 1,
        page_current: options.page,
        page_last: Math.ceil(count / PAGE_SIZE),
      },
    }
  },

  async findMany(query = {}, options = {}) {
    let result

    if (options.limit) {
      result = await this.query({
        $select: {
          from: {
            $select: { table, only: [`${table}.id`] },
            $join: options.join,
            $where: query,
            $group: `${table}.id`,
            $order: {
              by: options.orderBy,
              sort: options.sort,
              by_2: `${table}.id`,
            },
            $limit: {
              amount: options.limit,
              offset: options.offset,
            },
          },
          as: 'table',
        },
        $join: [
          { type: 'left', table, on: 'table.id', equals: `${table}.id` },
          ...options.join || [],
        ],
      })
    } else {
      result = await this.query({
        $select: {
          table,
          only: options.only,
        },
        $join: options.join,
        $join_active: options.join_active,
        $where: query,
        $order: {
          by: options.orderBy,
          sort: options.sort,
          by_2: `${table}.id`,
        },
        $limit: {
          amount: options.limit,
          offset: options.offset,
        },
      })
    }

    return result
  },

  async findOne(query = {}, options = {}) {
    const result = await this.query({
      $select: {
        table,
        only: options.only,
      },
      $join: options.join,
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
        by_2: `${table}.id`,
      },
      $limit: {
        amount: 1,
        offset: options.offset,
      },
    })

    return result[0] || null
  },

  async insertMany(rows = []) {
    const result = await this.query({
      $insert: { table, values: rows },
    })

    return result.insertId
  },

  async insertOne(row = []) {
    const result = await this.query({
      $insert: { table, value: row },
    })

    return result.insertId
  },

  async updateMany(query, data, options = {}) {
    const result = await this.query({
      $update: {
        table,
        set: data,
      },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: options.limit,
        offset: options.offset,
      },
    })

    return result.affectedRows
  },

  async updateOne(query, data, options = {}) {
    const result = await this.query({
      $update: { table, set: data },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: 1,
        offset: options.offset,
      },
    })

    return !!result.affectedRows
  },

  async upsertOne(query, data) {
    const { id } = await this.findOne(query) || {}

    if (id) {
      await this.updateOne({ id }, data)
      return id
    }

    return this.insertOne(data)
  },

  async removeMany(query = {}, options = {}) {
    const result = await this.query({
      $delete: { table },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: options.limit,
        offset: options.offset,
      },
    })

    return result.affectedRows
  },

  async removeOne(query = {}, options = {}) {
    const result = await this.query({
      $delete: { table },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: 1,
        offset: options.offset,
      },
    })

    return !!result.affectedRows
  },

})
