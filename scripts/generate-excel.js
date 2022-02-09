/* eslint-disable */
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

  sheet.properties.defaultColWidth = 25
  sheet.properties.defaultRowHeight = 25

  const column_defaults = {
    width: 25,
    height: 25,
    style: {
      font: {
        name: 'Arial',
        bold: true,
        size: 12,
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
      },
    },
  }
  
  sheet.columns = [
    { header: 'ID', key: 'id', hidden: true, ...column_defaults },
    { header: 'Categoría', key: 'categoria', ...column_defaults },
    { header: 'Activo', key: 'activo', ...column_defaults },
  ]

  return sheet
}

function addRow(sheet, data) {
  const row = sheet.addRow(data)
  row.font = { name: 'Arial', bold: false, size: 12 }
  const cell_cateogria = row.getCell(2)
  cell_cateogria.font = { name: 'Arial', bold: true, size: 12 }

  return row
}

export default function generateExcel() {
  const workbook = createWorkbook()
  
  const sheet = addSheet(workbook, 'Prueba')

  addRow(sheet, { id: 0, categoria: 'Hola Mundo!', activo: 'SI!' })

  workbook.xlsx.writeFile('out.xlsx')
}
