import jwt from 'jsonwebtoken'
import useAuth from './_controller.js'

const key = process.env.AUTH_KEY
const expiration = process.env.AUTH_EXPIRATION
const algorithm = process.env.AUTH_ALGORITHM

export default useAuth({ jwt }, { key, expiration, algorithm })