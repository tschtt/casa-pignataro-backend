import ExcelJS from 'exceljs'

export default function generateExcel() {
  const workbook = new ExcelJS.Workbook()

  workbook.creator = 'Casa Pignataro'
  workbook.created = new Date(Date.now())
  workbook.modified = new Date(Date.now())

  const sheet = workbook.addWorksheet('Prueba')

  sheet.properties.defaultColWidth = 25
  sheet.properties.defaultRowHeight = 25

  const style = {
    font: {
      name: 'Arial',
      bold: true,
      size: 12,
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center',
    },
  }

  sheet.columns = [
    { header: 'ID', key: 'id', hidden: true, width: 25, height: 25, style },
    { header: 'Categoría', key: 'categoria', width: 25, height: 25, style },
    { header: 'Activo', key: 'activo', width: 25, height: 25, style },
  ]

  const row = sheet.addRow({ id: 0, categoria: 'Hola Mundo!', activo: 'SI!' })
  row.font = { name: 'Arial', bold: false, size: 12 }

  const cell_cateogria = row.getCell(2)

  cell_cateogria.font = { name: 'Arial', bold: true, size: 12 }

  workbook.xlsx.writeFile('out.xlsx')
}
