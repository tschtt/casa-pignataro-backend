
function parseBoolean(value) {
  if (value === 'true' || value === 1) return true
  if (value === 'false' || value === 0) return false
  return value
}

export default ({ $admins }) => ({

  async findMany(request) {
    let { paginate, page, orderBy, sort, limit, offset, ...query } = request.query

    if (paginate) paginate = parseBoolean(paginate)
    if (page) page = parseInt(page)
    if (limit) limit = parseInt(limit)

    let { active, username, email, passwordReset } = query

    query = {}

    if (active) query.active = parseBoolean(active)
    if (username) query.username = { $like: username }
    if (email) query.email = { $like: email }
    if (passwordReset) query.passwordReset = parseBoolean(passwordReset)

    return paginate
      ? $admins.findPaginated(query, { page, orderBy, sort })
      : $admins.findMany(query, { orderBy, sort, limit, offset })
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    return $admins.findOne({ id })
  },

  async upsertOne(request) {
    let data

    data = request.body
    data.id = parseInt(request.params.id) || 0

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
