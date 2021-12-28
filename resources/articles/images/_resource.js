
export default ({ fs }) => ({

  insertMany(images = [], { fkArticle } = {}) {
    const folderPath = `files/articles/${fkArticle}`

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }

    images.forEach((image) => {
      const filePath = `${folderPath}/${image.name}`
      fs.copyFileSync(image.path, filePath)
    })

  },

})
