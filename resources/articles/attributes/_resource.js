
export default ({ table, schema, format }) => ({

  // example query
  // {
  //   $select: 'nn_article_attribute_value',
  //   $as: 'nn',
  //   $columns: [
  //     'nn.id', 'a.name', 'av.name as value',
  //   ],
  //   $join: [
  //     { type: 'left', table: 'attribute_value', as: 'av', on: { 'av.id' : 'nn.fkAttributeValue' } },
  //     { type: 'left', table: 'attribute',       as: 'a',  on: { 'a.id'  : 'nn.fkAttributeValue' } },
  //   ],
  //   $where: {
  //     fkArticle,
  //   },
  // }

  async findMany(query, options) {
    let items
    items = await table.findMany(query, options)
    items = await format.fillMany(items)
    return items
  },

  async findOne(query) {
    let item
    item = await table.findOne(query)
    item = await format.fillOne(item)
    return item
  },

})
