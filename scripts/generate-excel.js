import { connection } from '@packages/table'
import ExcelJS from 'exceljs'

// ExcelJS Helpers

function createWorkbook() {
  const workbook = new ExcelJS.Workbook()

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
    // style: {
    //   ...column_defaults.style,
    //   alignment: {
    //     ...column_defaults.style.alignment,
    //     // vertical: 'top',
    //     // horizontal: 'left',
    //     // wrapText: true,
    //   },
    // },
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
  row.getCell(8).alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
  row.getCell(9).alignment = { vertical: 'top', horizontal: 'left', wrapText: false }
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

function format({ section: sections, category: categories, article: articles }) {
  for (const article of articles) {
    const category = categories.find(category => category.id === article.fkCategory)

    article.active = article.active ? 'SI' : 'NO'
    article.category = category.name
    article.fkSection = category.fkSection
  }

  for (const section of sections) {
    section.articles = articles.filter(article => article.fkSection === section.id)
  }

  return sections
}

export default async function generateExcel() {
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

  workbook.xlsx.writeFile('out.xlsx')

  connection.end()
}
