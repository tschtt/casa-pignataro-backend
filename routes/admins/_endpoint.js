
// function parseQuery({ only, orderBy, order, limit, offset, ...query }) {
//   if (limit) {
//     limit = parseInt(limit)
//   }

//   if (offset) {
//     offset = parseInt(offset)
//   }

//   if (only) {
//     only = only.replace(/\s/g, '').split(',')
//   }

//   return {
//     query,
//     options: {
//       only,
//       orderBy,
//       order,
//       limit,
//       offset,
//     },
//   }
// }

export default ({ $admins }) => ({

  async findMany() {
    return $admins.findMany()
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    return $admins.findOne({ id })
  },

  async upsertOne(request) {
    let data

    data = request.body
    data.id = parseInt(request.params.id)

    const id = await $admins.upsertOne(data)
    const item = await $admins.findOne({ id })

    return item
  },

  async removeOne(request) {
    const id = parseInt(request.params.id)
    const removed = await $admins.removeOne({ id })
    return removed
  },

})
