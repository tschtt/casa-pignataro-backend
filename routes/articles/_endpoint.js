/* eslint-disable camelcase */

import fs from 'fs'

function parseBoolean(value) {
  if (['false', 'FALSE', '0'].includes(value)) return false
  if (['true', 'TRUE', '1'].includes(value)) return true
  return undefined
}

export default ({ $articles }) => ({

  async findMany(request) {
    const query = {}, options = {}

    const paginate = parseBoolean(request.query.paginate)
    const faceted = parseBoolean(request.query.faceted)

    // Options

    if (request.query.page) {
      options.page = parseInt(request.query.page) || undefined
    }

    if (request.query.orderBy) {
      const orderBy = request.query.orderBy

      if (['code', 'name', 'active', 'value'].includes(orderBy)) {
        options.orderBy = `article.${orderBy}`
      }

      else if (orderBy === 'section') {
        options.orderBy = 'section.name'
      }

      else if (orderBy === 'category') {
        options.orderBy = 'category.name'
      }

      else if (orderBy === 'attribute_name') {
        options.orderBy = 'attribute.name'
      }

      else if (orderBy === 'attribute_value') {
        options.orderBy = 'attribute_value.name'
      }
    }

    if (request.query.order) {
      options.sort = request.query.order
    }

    if (request.query.limit) {
      options.limit = parseInt(request.query.limit) || undefined
    }

    if (request.query.offset) {
      options.offset = parseInt(request.query.offset) || undefined
    }

    // Query

    if (request.query.code) {
      query['article.code'] = request.query.code
    }

    if (request.query.name) {
      query['article.name'] = request.query.name
    }

    if (request.query.minValue || request.query.maxValue) {
      query['article.value'] = {}
    }

    if (request.query.minValue) {
      query['article.value'].$gte = parseFloat(request.query.minValue) || undefined
    }

    if (request.query.maxValue) {
      query['article.value'].$lte = parseFloat(request.query.maxValue) || undefined
    }

    if (request.query.active) {
      query['article.active'] = parseBoolean(request.query.active)
    }

    if (request.query.fkCategory) {
      query['category.id'] = parseInt(request.query.fkCategory)
    }

    if (request.query.category) {
      query['category.name'] = request.query.category
    }

    if (request.query.fkSection) {
      query['section.id'] = parseInt(request.query.fkSection)
    }

    if (request.query.section) {
      query['section.name'] = request.query.section
    }

    if (request.query.attribute_name) {
      query['attribute.name'] = request.query.attribute_name
    }

    if (request.query.attribute_value) {
      query['attribute_value.name'] = request.query.attribute_value
    }

    if (request.query.search) {
      const search = request.query.search
      query.$or = [
        { 'article.code': search },
        { 'article.name': { $like: search } },
        { 'article.description': { $like: search } },
        { 'article.shortDescription': { $like: search } },
        { 'category.name': { $like: search } },
        { 'section.name': { $like: search } },
        { 'attribute.name': { $like: search } },
        { 'attribute_value.name': { $like: search } },
      ]
    }

    if (paginate) {
      return $articles.findPaginated(query, options)
    } if (faceted) {
      query['article.active'] = true
      return $articles.findFaceted(query, options)
    }
    return $articles.findMany(query, options)

  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    const item = await $articles.findOne({ 'article.id': id })
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

    return $articles.findOne({ 'article.id': id })
  },

  async updateOne(request) {
    let item, id

    id = parseInt(request.params.id)

    switch (request.headers['content-type'].split(';')[0]) {
      case 'multipart/form-data':
        item = JSON.parse(request.body.item)

        if (!item.images) {
          item.images = []
        }

        if (request.files) {
          item.images.push(...request.files.map((file) => {
            const path =  file.path.replace(/\\/g, '/')
            const extension = file.originalname.split('.').pop()
            fs.renameSync(path, `${path}.${extension}`)
            return `${path}.${extension}`
          }))
        }

        break
      case 'application/json':
        item = request.body
        break
      default:
        throw new Error('content-type not supported')
    }

    await $articles.updateOne({ id }, item)

    return $articles.findOne({ 'article.id': id })
  },

  async removeOne(request) {
    const id = request.params.id
    const result = await $articles.removeOne({ id })
    return result
  },

})
