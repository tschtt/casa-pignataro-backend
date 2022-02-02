
const PAGE_SIZE = parseInt(process.env.DATABASE_PAGE_SIZE)

export default ({ connection, builder: build }) => (table) => ({

  async query(query = {}) {
    const sql = build(query)
    console.log('Nueva query:')
    console.log(sql)
    console.log('')
    const result = query.$join
      ? await connection.query({ sql, nestTables: true })
      : await connection.query(sql)
    return result[0]
  },

  async count(query) {
    const result = await this.query({
      $select: {
        table,
        count: true,
      },
      $where: query,
    })

    return result[0]['COUNT(`id`)']
  },

  async findPaginated(query = {}, options = {}) {

    options.page = options.page || 1

    const count = await this.count(query)

    let items

    if (options.join) {
      items = await this.query({
        $select: {
          from: {
            $select: { table },
            $where: query,
            $limit: {
              amount: PAGE_SIZE,
              offset: PAGE_SIZE * (options.page - 1),
            },
          },
          as: 'article',
        },
        $join: options.join,
        $order: {
          by: options.orderBy,
          sort: options.sort,
        },
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
        },
        $limit: {
          amount: PAGE_SIZE,
          offset: PAGE_SIZE * (options.page - 1),
        },
      })
    }

    return {
      items,
      pagination: {
        item_count: count,
        page_first: 1,
        page_current: options.page,
        page_last: parseInt(count / PAGE_SIZE) + 1,
      },
    }
  },

  async findMany(query = {}, options = {}) {
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
      },
      $limit: {
        amount: options.limit,
        offset: options.offset,
      },
    })

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
