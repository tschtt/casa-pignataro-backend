import { InvalidTokenError, MissingAuthKeyError } from "./errors.js"

export default function useAuth({ jwt }, { key, expiration = 3600, algorithm = 'HS256' } = {}) {
  if(!key) {
    throw new MissingAuthKeyError()
  }
  return {

    generate(payload = {}, options = {}) {
      const jwt_key = options.key || key
      const jwt_options = {}
      
      jwt_options.expiresIn = options.expiration || expiration
      jwt_options.algorithm = options.algorithm || algorithm
    
      return jwt.sign(payload, jwt_key, jwt_options)
    },

    decode(token, options = {}) {
      const jwt_key = options.key || key
      const jwt_options = {}
      
      jwt_options.algorithms = []
      jwt_options.algorithms.push(options.algorithm || algorithm)

      try {
        return jwt.verify(token, jwt_key, jwt_options)
      } catch {
        throw new InvalidTokenError()
      }
    }
    
  }
}