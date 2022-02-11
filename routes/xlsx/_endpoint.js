/* eslint-disable no-plusplus */
/* eslint-disable no-sparse-arrays */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
import Excel from 'exceljs'
import fs from 'fs'
import client from 'https'

async function downloadImage({ url, path, name, ext }) {

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }

  const filepath = `${path}/${name}.${ext}`

  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
          res.pipe(fs.createWriteStream(filepath))
              .on('error', reject)
              .once('close', () => resolve(filepath))
      } else {
          // Consume response data to free up memory
          res.resume()
          reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`))

      }
    })
})
}

export default function useEndpoint({ connection }) {

  // Excel Helpers

  function createWorkbook() {
    const workbook = new Excel.Workbook()

    workbook.creator = 'Casa Pignataro'
    workbook.created = new Date(Date.now())
    workbook.modified = new Date(Date.now())

    return workbook
  }

  function addSheet(workbook, name) {
    const sheet = workbook.addWorksheet(name)

    sheet.properties.defaultColWidth = 30
    sheet.properties.defaultRowHeight = 50

    const column_defaults = {
      width: 30,
      height: 50,
      style: {
        font: {
          name: 'Arial',
          bold: true,
          size: 14,
        },
        alignment: {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        },
      },
    }

    const column_no_wrap = {
      ...column_defaults,
      width: 50,
    }

    sheet.columns = [
      { ...column_defaults, header: 'ID', key: 'id', hidden: true },
      { ...column_defaults, header: 'Categoría', key: 'category' },
      { ...column_defaults, header: 'Activo', key: 'active' },
      { ...column_defaults, header: 'Codigo', key: 'code' },
      { ...column_defaults, header: 'Nombre', key: 'name' },
      { ...column_defaults, header: 'Valor', key: 'value' },
      { ...column_defaults, header: 'Atributos', key: 'attributes' },
      { ...column_no_wrap,  header: 'Descripcion Breve', key: 'shortDescription' },
      { ...column_no_wrap,  header: 'Descripcion', key: 'description' },
      { ...column_no_wrap,  header: 'Imagenes', key: 'images' },
    ]

    return sheet
  }

  function addRow(sheet, data) {
    const row = sheet.addRow(data)

    row.font = { name: 'Arial', bold: false, size: 12 }

    row.getCell(2).font = { name: 'Arial', bold: true, size: 14 }
    row.getCell(7).alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
    row.getCell(8).alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
    row.getCell(9).alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
    row.getCell(10).alignment = { vertical: 'top', horizontal: 'left', wrapText: false }

    return row
  }

  // Database Helpers

  function format(sql, values) {
    return connection.format(sql, values)
  }

  async function query(sql, values) {
    sql = format(sql, values)
    console.log(`${sql}\n`)
    const result = await connection.query(sql)
    return result[0]
  }

  async function query_join(sql, values) {
    const result = {}

    const rows = (await connection.query({ sql, values, nestTables: true }))[0]

    for (const table_name in rows[0]) {
      if (Object.hasOwnProperty.call(rows[0], table_name)) {
        result[table_name] = []
      }
    }

    for (const row of rows) {
      for (const table_name in row) {
        if (Object.hasOwnProperty.call(row, table_name)) {
          if (row[table_name].id && !result[table_name].find(item => item.id === row[table_name].id)) {
            result[table_name].push(row[table_name])
          }
        }
      }
    }

    return result
  }

  function group(rows) {

    for (const nn of rows.nn) {
      const value = rows.value.find(value => value.id === nn.fkAttributeValue)
      const attribute = rows.attribute.find(attribute => attribute.id === value.fkAttribute)

      nn.name = attribute.name
      nn.value = value.name

    // rows.nn.push(nn)
    }

    for (const article of rows.article) {
      const category = rows.category.find(category => category.id === article.fkCategory)
      const attributes = rows.nn.filter(attribute => attribute.fkArticle === article.id)

      article.active = article.active ? 'SI' : 'NO'
      article.category = category.name
      article.fkSection = category.fkSection
      article.attributes = attributes.map(a => `${a.name}: ${a.value}`).join('\n')
    }

    for (const section of rows.section) {
      section.articles = rows.article.filter(article => article.fkSection === section.id)
    }

    return rows.section
  }

  return {
    async import(request) {
      const workbook = new Excel.Workbook()

      function validateSheet(sheet) {
        const header = sheet.getRow(1)
        const header_schema = [, 'ID', 'Categoría', 'Activo', 'Codigo', 'Nombre', 'Valor', 'Atributos', 'Descripcion Breve', 'Descripcion', 'Imagenes']

        for (let i = 1; i < header_schema.length; i++) {
          if (header.getCell(i).value !== header_schema[i]) {
            console.log(header.getCell(i).value)
            console.log(header_schema[i])
            throw new Error('El documento no cuenta con el formato requerido')
          }
        }
      }

      async function updateSections(sections) {
        // remove the rest
        await query('update section set active = false')

        if (!sections.length) {
          return sections
        }

        // find rows for update
        const rows_update = await query('select * from section where name in (?)', [sections.map(s => s.name)])

        // upsert sections
        await query('insert into section (id, name) values ? on duplicate key update active = true', [
          sections.map(({ name }) => {
            const { id = 0 } = rows_update.find(s => s.name === name) || {}
            return [id, name]
          }),
        ])

        // get active rows
        const rows = await query('select * from section where active = true')

        // format the sections and the section's categories
        return sections.map(({ fid, name }) => {
          const { id } = rows.find(s => s.name === name)
          return { id, fid, name }
        })
      }

      async function updateCategories(categories, { sections }) {
        await query('update category set active = false')

        if (!categories.length) {
          return categories
        }

        // find rows to update
        const rows_update = await query(`
          select * from category
          where id in (
            select id from category where (${
              sections.map(section =>
                format('(fkSection = ? and name in (?))', [
                  section.id,
                  categories.filter(c => c.ffkSection === section.fid).map(c => c.name),
                ])).join('or')
            })
          )
        `)

        // upsert sections
        await query('insert into category (id, fkSection, name) values ? on duplicate key update active = true', [
          categories.map(({ ffkSection, name }) => {
            const { id: fkSection } = sections.find(s => s.fid === ffkSection)
            const { id = 0 } = rows_update.find(row => row.name === name && row.fkSection === fkSection) || {}
            return [id, fkSection, name]
          }),
        ])

        // get active rows
        const rows = await query('select * from category where active = true')

        // format the sections and the section's categories
        return categories.map(({ fid, ffkSection, name }) => {
          const { id: fkSection } = sections.find(s => s.fid === ffkSection)
          const { id } = rows.find(r => r.name === name && r.fkSection === fkSection)
          return { id, fid, fkSection, name }
        })
      }

      async function updateArticles(articles, { categories }) {
        await query('update article set active = false')

        if (!articles.length) {
          return articles
        }

        // find rows to update
        const rows_update = await query('select * from article where code in (?)', [
          articles.map(a => a.code),
        ])

        // upsert sections
        await query('insert into article (id, active, code, name, value, description, shortDescription, fkCategory) values ? on duplicate key update active = true', [
          articles.map(({ active, code, name, value, description, shortDescription, ffkCategory }) => {
            const { id = 0 } = rows_update.find(row => row.code === code) || {}
            const { id: fkCategory } = categories.find(c => c.fid === ffkCategory)
            return [id, active, code, name, value, description, shortDescription, fkCategory]
          }),
        ])

        // get active rows
        const rows = await query('select * from article where active = true')

        // format the sections and the section's categories
        return articles.map(({ fid, active, code, name, value, description, shortDescription, ffkCategory }) => {
          const { id = 0, fkCategory } = rows.find(row => row.code === code) || {}
          return { id, fid, active, code, name, value, description, shortDescription, fkCategory, ffkCategory }
        })
      }

      async function updateAttributes(attributes, { categories }) {
        await query('update attribute set active = false')

        if (attributes.length === 0) {
          return attributes
        }

        // find rows to update
        const rows_update = await query(`
          select * from attribute
          where id in (
            select id from attribute where (${
              categories.map(category =>
                format('(fkCategory = ? and name in (?))', [
                  category.id,
                  attributes.filter(a => a.ffkCategory === category.fid).map(a => a.name),
                ])).join('or')
            })
          )
        `)

        // upsert sections
        await query('insert into attribute (id, name, fkCategory) values ? on duplicate key update active = true', [
          attributes.map(({ name, ffkCategory }) => {
            const { id: fkCategory } = categories.find(c => c.fid === ffkCategory)
            const { id = 0 } = rows_update.find(row => row.name === name && row.fkCategory === fkCategory) || {}
            return [id, name, fkCategory]
          }),
        ])

        // get active rows
        const rows = await query('select * from attribute where active = true')

        // format the sections and the section's categories
        return attributes.map(({ fid, ffkCategory, name }) => {
          const { id: fkCategory } = categories.find(c => c.fid === ffkCategory)
          const { id } = rows.find(r => r.name === name && r.fkCategory === fkCategory)
          return { id, fid, fkCategory, name }
        })
      }

      async function updateAttributeValues(values, { attributes }) {
        await query('update attribute_value set active = false')

        if (values.length === 0) {
          return values
        }

        // find rows to update
        const rows_update = await query(`
          select * from attribute_value
          where id in (
            select id from attribute_value where (${
              attributes.map(attribute =>
                format('(fkAttribute = ? and name in (?))', [
                  attribute.id,
                  values.filter(v => v.ffkAttribute === attribute.fid).map(a => a.name),
                ])).join('or')
            })
          )
        `)

        // upsert sections
        await query('insert into attribute_value (id, name, fkAttribute) values ? on duplicate key update active = true', [
          values.map(({ name, ffkAttribute }) => {
            const { id: fkAttribute } = attributes.find(a => a.fid === ffkAttribute)
            const { id = 0 } = rows_update.find(row => row.name === name && row.fkAttribute === fkAttribute) || {}
            return [id, name, fkAttribute]
          }),
        ])

        // get active rows
        const rows = await query('select * from attribute_value where active = true')

        // format the sections and the section's attributes
        return values.map(({ fid, ffkAttribute, name }) => {
          const { id: fkAttribute } = attributes.find(a => a.fid === ffkAttribute)
          const { id } = rows.find(r => r.name === name && r.fkAttribute === fkAttribute)
          return { id, fid, fkAttribute, name }
        })
      }

      async function updateArticleValues(article_values, { articles, values }) {

        article_values = article_values.map(av => {
          return {
            fid: av.fid,
            fkArticle: articles.find(a => a.fid === av.ffkArticle).id,
            fkAttributeValue: values.find(v => v.fid === av.ffkAttributeValue).id,
          }
        })

        await query('update nn_article_attribute_value set active = false')

        if (article_values.length === 0) {
          return article_values
        }

        // find rows to update
        const rows_update = await query(`
          select * from nn_article_attribute_value
          where (${
            article_values.map(av => {
              return format('(fkAttributeValue = ? and fkArticle = ?)', [av.fkAttributeValue, av.fkArticle])
            }).join('or')
          })
        `)

        // upsert sections
        await query('insert into nn_article_attribute_value (id, fkAttributeValue, fkArticle) values ? on duplicate key update active = true', [
          article_values.map(({ fkArticle, fkAttributeValue }) => {
            const { id = 0 } = rows_update.find(row => row.fkAttributeValue === fkAttributeValue && row.fkArticle === fkArticle) || {}
            return [id, fkAttributeValue, fkArticle]
          }),
        ])

        // get active rows
        const rows = await query('select * from nn_article_attribute_value where active = true')

        // format the sections and the section's values
        return article_values.map(({ fid, fkArticle, fkAttributeValue }) => {
          const { id = 0 } = rows.find(row => row.fkAttributeValue === fkAttributeValue && row.fkArticle === fkArticle) || {}
          return { id, fid, fkAttributeValue, fkArticle }
        })
      }

      async function updateArticleImages(images, { articles }) {
        images = images.map(i => {
          return {
            url: i.url,
            fkArticle: articles.find(a => a.fid === i.ffkArticle).id,
          }
        })

        const promesas = []

        for (const article of articles) {
          const path = `files/articles/${article.id}`

          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
          }

          const article_images = images.filter(i => i.fkArticle === article.id)

          for (let i = 0; i < article_images.length; i++) {
            const url = article_images[i].url
            const name = `${Date.now()}${i}`
            const ext = url.split('.').pop()
            promesas.push(downloadImage({ url, path, name, ext }))
          }
        }

        await Promise.all(promesas)

        return images
      }

      await workbook.xlsx.readFile(request.file.path)

      let sections = []
      let categories = []
      let attributes = []
      let values = []
      let articles = []
      let article_values = []
      let article_images = []

      workbook.eachSheet((sheet) => {
        validateSheet(sheet)

        let section = sections.find(s => s.name === sheet.name)
        if (!section) {
          section = { fid: sections.length + 1, name: sheet.name }
          sections.push(section)
        }

        sheet.eachRow((row, n) => {
          if (n === 1) return

          const row_category = row.values[2]
          let row_attributes = []
          if (row.values[7]) {
            row.values[7].split('\n').map(v => v.split(': ')).map(v => ({ name: v[0], value: v[1] || 'SI' }))
          }

          let category = categories.find(c => c.name === row_category && c.ffkSection === section.fid)
          if (!category) {
            category = { fid: categories.length + 1, ffkSection: section.fid, name: row_category }
            categories.push(category)
          }

          let article = {
            id: row.values[1],
            fid: articles.length + 1,
            ffkCategory: category.fid,
            active: (row.values[3]).toLowerCase() === 'si' ? true : false,
            code: row.values[4],
            name: row.values[5],
            value: parseFloat(row.values[6]),
            shortDescription: row.values[8],
            description: row.values[9],
          }
          articles.push(article)

          if (row.values[10]) {
            const images = row.values[10].text.split('\n') || []
            article_images.push(...images.map(url => {
              return { ffkArticle: article.fid, url }
            }))
          }

          for (const row_attribute of row_attributes) {
            let attribute = attributes.find(a => a.name === row_attribute.name && a.ffkCategory === category.fid)
            if (!attribute) {
              attribute = { fid: attributes.length + 1, ffkCategory: category.fid, name: row_attribute.name }
              attributes.push(attribute)
            }

            let value = values.find(v => v.name === row_attribute.value && v.ffkAttribute === attribute.fid)
            if (!value) {
              value = { fid: values.length + 1, ffkAttribute: attribute.fid, name: row_attribute.value }
              values.push(value)
            }

            let article_value = article_values.find(av => av.ffkArticle === article.fid && av.ffkAttributeValue === value.fid)
            if (!article_value) {
              article_value = { fid: article_values.length + 1, ffkArticle: article.fid, ffkAttributeValue: value.fid }
              article_values.push(article_value)
            }
          }

        })
      })

      try {
        await query('START TRANSACTION')

        sections = await updateSections(sections)
        categories = await updateCategories(categories, { sections })
        articles = await updateArticles(articles, { categories })
        attributes = await updateAttributes(attributes, { categories })
        values = await updateAttributeValues(values, { attributes })
        article_values = await updateArticleValues(article_values, { articles, values })
        article_images = await updateArticleImages(article_images, { articles })

        await query('COMMIT')

        return {
          sections,
          categories,
          articles,
          attributes,
          values,
          article_values,
          article_images,
        }
      } catch (error) {
        await query('ROLLBACK')
        throw error
      }
    },
    async export(request, response) {
      const workbook = createWorkbook()

      const rows = await query_join(`
        select * from section
        left join category on category.fkSection = section.id
        left join article on article.fkCategory = category.id
        left join nn_article_attribute_value nn on nn.fkArticle = article.id
        left join attribute_value value on value.id = nn.fkAttributeValue
        left join attribute on attribute.id = value.fkAttribute;
      `)

      const sections = group(rows)

      for (const section of sections) {
        const sheet = addSheet(workbook, section.name)

        for (const article of section.articles) {
          addRow(sheet, article)
        }

      }

      if (!fs.existsSync('files/xlsx')) {
        fs.mkdirSync('files/xlsx')
      }

      const filename = `files/xlsx/${Date.now()}.xlsx`

      await workbook.xlsx.writeFile(filename)

      response.download(filename)
    },
  }
}
