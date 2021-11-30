
export default ({ table }) => ({

  async findMany(query, { hidePassword = true, ...options } = {}) {
    let items
    
    items = await table.findMany(query, options)

    if(hidePassword) {
      items = items.map(item => { delete item.password; return item })      
    }
    
    return items
  },

  async findOne(query, { hidePassword = true, ...options } = {}) {
    let item

    item = await table.findOne(query, options)
    
    if(item && hidePassword) {
      delete item.password
    }
    
    return item
  },

  async upsertOne(item, options) {
    const result = await table.upsertOne(item, options)
    return result
  },

  async removeOne(query, options) {
    const result = await table.removeOne(query, options)
    return result
  },

})