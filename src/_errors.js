
export class MissingDataError extends Error {
  constructor() {
    super(`Faltan datos`)
    this.name = 'MissingDataError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingDataError)
    }
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super(`No se encontró el usuario`)
    this.name = 'UserNotFoundError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, UserNotFoundError)
    }
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super(`Contraseña invalida`)
    this.name = 'InvalidPasswordError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPasswordError)
    }
  }
}