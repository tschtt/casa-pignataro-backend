
/**
 * @param {Object} dependencies
 * @param {import('fs')} dependencies.fs
 * @param {import('sharp')} dependencies.sharp
 */
export default function useImages({ fs, sharp }) {
  return {

    findMany(path) {
      if (fs.existsSync(`files/${path}`)) {
        return fs.readdirSync(`files/${path}`).map((file) => {
          return `${process.env.APP_URL}/files/${path}/${file}`
        })
      }
      return []
    },

    insertMany(path, files) {
      if (!fs.existsSync(`files/${path}`)) {
        fs.mkdirSync(`files/${path}`, { recursive: true })
      }

      files.forEach((file) => {
        sharp(fs.readFileSync(file.path))
          .resize(500)
          .jpeg({ mozjpeg: true })
          .toFile(`files/${path}/${file.filename}.jpeg`, () => {
            fs.unlinkSync(file.path)
          })
      })
    },

    removeMany(path) {
      if (fs.existsSync(`files/${path}`)) {
        fs.rmSync(`files/${path}`, { recursive: true })
      }
    },

    removeNotIn(path, files = []) {
      if (!fs.existsSync(`files/${path}`)) {
        return false
      }

      const images = fs.readdirSync(`files/${path}`)

      images.forEach((image) => {
        if (!files.includes(image)) {
          fs.rmSync(`files/${path}/${image}`)
        }
      })

      return true
    },

  }
}
