
export class AuthenticationFailedError extends Error {
  constructor(message) {
    super(`No se pudo autenticar su pedido: ${message}`)
    this.name = 'AuthenticationFailedError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationFailedError)
    }
  }
}
