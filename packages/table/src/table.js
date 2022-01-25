
const PAGE_SIZE = parseInt(process.env.DATABASE_PAGE_SIZE)

export default ({ connection, builder: build }) => (table) => ({

  async query(query = {}) {
    const sql = build(query)
    // console.log(sql)
    const result = await connection.query(sql)
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

  async findPaginated(query, { page = 1, only, orderBy, sort } = {}) {
    const count = await this.count(query)

    const items = await this.findMany(query, {
      only,
      orderBy,
      sort,
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * (page - 1),
    })

    return {
      items,
      pagination: {
        item_count: count,
        page_first: 1,
        page_current: page,
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

  async upsertOne({ id, ...data }, options = {}) {
    if (id) {
      const wasChanged = await this.updateOne({ id }, data, options)
      if (wasChanged) {
        return id
      }
    }
    return this.insertOne(data, options)
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
