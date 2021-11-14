
export class MissingDataError extends Error {
  constructor() {
    super('Faltan datos')
    this.name = 'MissingDataError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingDataError)
    }
  }
}

export class MissingAuthKeyError extends Error {
  constructor() {
    super('Error en @taschetta/auth: falta definir key')
    this.name = 'MissingAuthKeyError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingAuthKeyError)
    }
  }
}

export class InvalidUsernameError extends Error {
  constructor() {
    super('No se encontró el usuario')
    this.name = 'InvalidUsernameError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidUsernameError)
    }
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Contraseña invalida')
    this.name = 'InvalidPasswordError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPasswordError)
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