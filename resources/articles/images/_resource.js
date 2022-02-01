/* eslint-disable camelcase */

import fs from 'fs'

export default () => ({

  findMany({ fkArticle }) {
    if (fs.existsSync(`files/articles/${fkArticle}`)) {
      return fs.readdirSync(`files/articles/${fkArticle}`).map((file) => {
        return `${process.env.APP_URL}/files/articles/${fkArticle}/${file}`
      })
    }
    return []
  },

  insertMany(images = [], { fkArticle } = {}) {
    const path_folder = `files/articles/${fkArticle}`

    if (!fs.existsSync(path_folder)) {
      fs.mkdirSync(path_folder, { recursive: true })
    }

    images.forEach((path) => {
      const fileName = path.split('/').pop()
      const filePath = `${path_folder}/${fileName}`
      fs.renameSync(path, filePath)
    })

  },

  // removes the images not present on the images array
  // how?
  // - moves every image in the array to files/articles/temp/:id (new and old images)
  // - empties the files/article/:id folder (removing the images not in the array)
  // - copies the files from files/articles/temp/:id to files/article/:id
  updateMany({ fkArticle }, images = []) {
    const path_temp = `files/articles/temp/${fkArticle}`
    const path_article = `files/articles/${fkArticle}`

    // create temp folder if does not exists
    if (!fs.existsSync(path_temp)) {
      fs.mkdirSync(path_temp, { recursive: true })
    }

    // move every image in the array to the temp folder
    images.forEach((path) => {
      path = path.replace(`${process.env.APP_URL}/`, '')
      if (fs.existsSync(path)) {
        const name = path.split('/').pop()
        fs.renameSync(path, `${path_temp}/${name}`)
      }
    })

    // delete article folder if it exists
    if (fs.existsSync(path_article)) {
      fs.rmSync(path_article, { recursive: true })
    }

    // read the contents from the path folder
    images = fs.readdirSync(path_temp)

    // create the article folder
    fs.mkdirSync(path_article, { recursive: true })

    // move every image from temp to article
    images.forEach((image) => {
      fs.renameSync(`${path_temp}/${image}`, `${path_article}/${image}`)
    })

    // remove the temp folder
    fs.rmSync(path_temp, { recursive: true })
  },

  removeMany({ fkArticle }) {
    const path_article = `files/articles/${fkArticle}`
    if (fs.existsSync(path_article)) {
      fs.rmSync(path_article, { recursive: true })
    }
  },

})
