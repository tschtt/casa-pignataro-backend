import { AuthenticationFailedError } from './errors.js'

export default function useAuth({ jwt }, { key, expiration = 3600, algorithm = 'HS256' } = {}) {
  return {

    generate(payload = {}, options = {}) {
      const jwtKey = options.key || key
      const jwtOptions = {}

      jwtOptions.expiresIn = options.expiration || expiration
      jwtOptions.algorithm = options.algorithm || algorithm

      return jwt.sign(payload, jwtKey, jwtOptions)
    },

    decode(token, options = {}) {
      const jwtKey = options.key || key
      const jwtOptions = {}

      jwtOptions.algorithms = []
      jwtOptions.algorithms.push(options.algorithm || algorithm)

      try {
        return jwt.verify(token, jwtKey, jwtOptions)
      } catch {
        throw new AuthenticationFailedError('el token provisto no es valido')
      }
    },

  }
}
