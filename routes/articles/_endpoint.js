
import fs from 'fs'

function parseBoolean(value) {
  if (value === false || value === 'true' || value === 1) return true
  if (value === false || value === 'false' || value === 0) return false
  return value
}

export default ({ $articles }) => ({

  async findMany(request) {
    let { paginate, page, orderBy, sort, limit, offset, ...query } = request.query
    let { search, active } = query

    query = {}

    // Options

    if (paginate) {
      paginate = parseBoolean(paginate)
    }
    if (page) {
      page = parseInt(page)
    }
    if (limit) {
      limit = parseInt(limit)
    }
    if (offset) {
      offset = parseInt(offset)
    }

    // Query

    if (active) {
      query.active = parseBoolean(active)
    }
    if (search) {
      query.$or = [
        { code: search },
        { name: { $like: search } },
        { description: { $like: search } },
        { shortDescription: { $like: search } },
      ]
    }

    const result = paginate
      ? await $articles.findPaginated(query, { page, orderBy, sort })
      : await $articles.findMany(query, { limit, offset, orderBy, sort })

    return result
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    const item = await $articles.findOne({ id })
    return item
  },

  async insertOne(request) {

    let item

    switch (request.headers['content-type'].split(';')[0]) {
      case 'multipart/form-data':
        item = JSON.parse(request.body.item)
        item.images = request.files.map((file) => {
          const path =  file.path.replace(/\\/g, '/')
          const extension = file.originalname.split('.').pop()
          fs.renameSync(path, `${path}.${extension}`)
          return `${path}.${extension}`
        })
        break
      case 'application/json':
        item = request.body
        break
      default:
        throw new Error('content-type not supported')
    }

    const id = await $articles.insertOne(item)

    return $articles.findOne({ id })
  },

  // async insertOne(request) {
  //   let item, id

  //   item = request.body

  //   item.id = 0
  //   item.fkCategory = parseInt(item.fkCategory)
  //   item.active = parseBoolean(item.active)
  //   item.value = parseFloat(item.value)

  //   item.images = request.files.map((file) => {
  //     const path =  file.path.replace(/\\/g, '/')
  //     const extension = file.originalname.split('.').pop()
  //     fs.renameSync(path, `${path}.${extension}`)
  //     return `${path}.${extension}`
  //   })

  //   id = await $articles.insertOne(item)

  //   return $articles.findOne({ id })
  // },

  async updateOne(request) {

    const id = parseInt(request.params.id)
    const item = request.body

    await $articles.updateOne({ id }, item)

    return $articles.findOne({ id })
    // let item, id

    // id = parseInt(request.params.id)

    // item = request.body

    // item.id = id
    // item.fkCategory = parseInt(item.fkCategory)
    // item.active = parseBoolean(item.active)
    // item.value = parseFloat(item.value)

    // if (!item.images) {
    //   item.images = []
    // }

    // item.images = item.images.map((image) => {
    //   return image.replace(`${process.env.APP_URL}/`, '')
    // })

    // if (request.files) {
    //   item.images.push(...request.files.map((file) => {
    //     const path =  file.path.replace(/\\/g, '/')
    //     const extension = file.originalname.split('.').pop()
    //     fs.renameSync(path, `${path}.${extension}`)
    //     return `${path}.${extension}`
    //   }))
    // }

    // await $articles.updateOne({ id }, item)

    // return $articles.findOne({ id })
  },

  async removeOne(request) {
    const id = request.params.id
    const result = await $articles.removeOne({ id })
    return result
  },

})
