
export class AuthenticationError extends Error {
  constructor(message) {
    super(`No se pudo autenticar su pedido: ${message}`)
    this.name = 'AuthenticationError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError)
    }
  }
}
