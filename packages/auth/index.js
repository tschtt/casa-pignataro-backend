import jwt from 'jsonwebtoken'
import useAuth from './src/auth.js'
import useMiddleware from './src/middleware.js'

const key = process.env.AUTH_KEY
const expiration = process.env.AUTH_EXPIRATION
const algorithm = process.env.AUTH_ALGORITHM

export const auth = useAuth({ jwt }, { key, expiration, algorithm })
export const middleware = useMiddleware({ auth })

export default auth
