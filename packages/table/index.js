import mysql, { format } from 'mysql2/promise.js'
import useConnection from './src/connection.js'
import useBuilder from './src/builder.js'
import configTable from './src/table.js'

export const connection = await useConnection({ mysql })
export const builder = useBuilder({ format })
export const useTable = configTable({ connection, builder })

export default useTable
