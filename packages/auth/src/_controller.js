
export default function useAuth({ jwt }, { key, expiration, algorithm }) {
  return {

    generate(payload = {}, options = {}) {
      const jwt_key = options.key || key
      const jwt_options = {}
      
      jwt_options.expiresIn = options.expiration || expiration
      jwt_options.algorithm = options.algorithm || algorithm
      
      return jwt.sign(payload, jwt_key, jwt_options)
    }
    
  }
}