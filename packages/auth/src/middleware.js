import { AuthenticationFailedError } from './errors.js'

export default ({ auth }) => (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    throw new AuthenticationFailedError('el header authorization no esta definido')
  }

  const prefix = authorization.split(' ')[0]
  const token = authorization.split(' ')[1]

  if (prefix.toLowerCase() !== 'bearer') {
    throw new AuthenticationFailedError('el encabezado de autorizacion no cumple con el formato requerido')
  }

  let payload

  try {
    payload = auth.decode(token)
  } catch {
    throw new AuthenticationFailedError('el token provisto no es valido')
  }

  const PAYLOAD_TYPE = process.env.AUTH_PAYLOAD_TYPE

  if (PAYLOAD_TYPE && payload.type !== PAYLOAD_TYPE) {
    throw new AuthenticationFailedError('el token provisto no es valido')
  }

  req.auth = {}
  req.auth.payload = payload

  next()
}
