import fs from 'fs'
import sharp from 'sharp'

export default ({ table }) => ({

  async findMany() {
    let items
    items = await table.findMany()
    return items
  },

  async findOne(request) {
    let item
    item = await table.findOne({ id: request.params.id })
    return item
  },

  async insertOne(request) {
    const data = request.body

    const id = await table.insertOne(data)

    if (!fs.existsSync('files')) {
      fs.mkdirSync('files')
    }

    fs.mkdirSync(`files/${id}`)

    request.files.forEach((file) => {
      sharp(fs.readFileSync(file.path))
        .resize(500)
        .jpeg({ mozjpeg: true })
        .toFile(`files/${id}/${file.filename}.jpeg`, () => {
          fs.unlinkSync(file.path)
        })
    })

    return table.findOne({ id })
  },

  async updateOne(request) {
    const id = parseInt(request.params.id)
    const data = request.body
    await table.updateOne({ id }, data)
    return table.findOne({ id })
  },

  async removeOne(request) {
    return table.removeOne({ id: request.params.id })
  },

})
