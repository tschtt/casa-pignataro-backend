import mysql from 'mysql2/promise'
import configTable from './_table.js'

const database = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7Ujm6Yhn2Wsx',
  database: 'pecomtos',
})

const useTable = configTable({ database })

export default useTable