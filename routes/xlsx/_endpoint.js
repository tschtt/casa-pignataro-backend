/* eslint-disable */
import Excel from 'exceljs'
import fs from 'fs'

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

  async function query(sql, values) {
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

  function format(rows) {

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

      await workbook.xlsx.readFile(request.file.path)

      // get data from workbook

      const sections = []

      workbook.eachSheet((sheet) => {
        const section = {}

        section.name = sheet.name
        section.articles = []

        // validate the sheet
        
        const header = sheet.getRow(1)
        const header_schema = [, 'ID', 'Categoría', 'Activo', 'Codigo', 'Nombre', 'Valor', 'Atributos', 'Descripcion Breve', 'Descripcion', 'Imagenes']

        for (let i = 1; i < header_schema.length; i++) {
          if (header.getCell(i).value !== header_schema[i]) {
            throw new Error('Documento Invalido')
          }
        }

        sheet.eachRow((row, n) => {
          if(n === 1) return
          section.articles.push({
            id: row.values[1],
            category: row.values[2],
            active: row.values[3],
            code: row.values[4],
            name: row.values[5],
            value: row.values[6],
            attributes: row.values[7].split('\n').map(v => v.split(': ')).map(v => ({ name: v[0], value: v[1]})),
            shortDescription: row.values[8],
            description: row.values[9],
            images: row.values[10]?.split('\n') || [],
          })
        })


        sections.push(section)
      })

      fs.writeFileSync('data.json', JSON.stringify(sections, null, 2))
      
      return {
        success: true,
      }
    },
    async export(request, response) {
      const workbook = createWorkbook()

      const rows = await query(`
        select * from section
        left join category on category.fkSection = section.id
        left join article on article.fkCategory = category.id
        left join nn_article_attribute_value nn on nn.fkArticle = article.id
        left join attribute_value value on value.id = nn.fkAttributeValue
        left join attribute on attribute.id = value.fkAttribute;
      `)

      const sections = format(rows)

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
