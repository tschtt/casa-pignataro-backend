
function parseBoolean(value) {
  if (value === true || value === 'true' || value === 1) return true
  if (value === false || value === 'false' || value === 0) return false
  return undefined
}

export default ({ $admins }) => ({

  async findMany(request) {
    let { paginate, page, orderBy, sort, limit, offset, ...query } = request.query

    if (paginate) paginate = parseBoolean(paginate)
    if (page) page = parseInt(page)
    if (limit) limit = parseInt(limit)

    let { search, active, username, email, passwordReset } = query

    query = {}

    if (active) {
      query.active = parseBoolean(active)
    }
    if (passwordReset) {
      query.passwordReset = parseBoolean(passwordReset)
    }
    if (username) {
      query.username = username
    }
    if (email) {
      query.email = email
    }
    if (search) {
      query.$or = [
        { username: { $like: search } },
        { email: { $like: search } },
      ]
    }

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
