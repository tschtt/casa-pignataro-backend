import mysql, { format } from 'mysql2/promise'
import useConnection from './_connection.js'
import useBuilder from './_builder.js'
import configTable from './_table.js'

export const connection = await useConnection({ mysql })
export const builder = useBuilder({ format })
export const useTable = configTable({ connection, builder })
export default useTable