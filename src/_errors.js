export class MissingDataError extends Error {
  constructor() {
    super('Faltan datos')
    this.name = 'MissingDataError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingDataError)
    }
  }
}

export class InvalidUsernameError extends Error {
  constructor() {
    super('No se encontró el usuario')
    this.name = 'InvalidUsernameError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidUsernameError)
    }
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Contraseña invalida')
    this.name = 'InvalidPasswordError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPasswordError)
    }
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('No se pudo autenticar tu pedido')
    this.name = 'UnauthorizedError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError)
    }
  }
}
