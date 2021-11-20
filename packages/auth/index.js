import jwt from 'jsonwebtoken'
import useAuth from './src/auth.js'

const key = process.env.AUTH_KEY
const expiration = process.env.AUTH_EXPIRATION
const algorithm = process.env.AUTH_ALGORITHM

export default useAuth({ jwt }, { key, expiration, algorithm })