export class MissingAuthKeyError extends Error {
  constructor() {
    super('Error en @packages/auth: falta definir key')
    this.name = 'MissingAuthKeyError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingAuthKeyError)
    }
  }
}

export class InvalidTokenError extends Error {
  constructor() {
    super('El token provisto es invalido')
    this.name = 'InvalidTokenError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidTokenError)
    }
  }
}