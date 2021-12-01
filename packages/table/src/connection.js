/* eslint-disable no-console */

const HOST = process.env.DATABASE_HOST
const USER = process.env.DATABASE_USER
const PASSWORD = process.env.DATABASE_PASSWORD
const NAME = process.env.DATABASE_NAME
const PORT = process.env.DATABASE_PORT

export default async ({ mysql }) => {
  const connection = await mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: NAME,
    port: PORT,
  })

  console.log('Connected to the database')

  return connection
}
