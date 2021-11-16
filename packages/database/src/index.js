import mysql from 'mysql2/promise'
import configTable from './_controller.js'

const database = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7Ujm6Yhn2Wsx',
  database: 'casa_pignataro',
})

const useTable = configTable({ database })

export default useTable