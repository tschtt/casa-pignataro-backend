import mysql, { format } from 'mysql2/promise'
import useBuilder from './_builder.js'
import configTable from './_table.js'

const database = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7Ujm6Yhn2Wsx',
  database: 'casa_pignataro',
})

const builder = useBuilder({ format })
const useTable = configTable({ database, builder })

export default useTable