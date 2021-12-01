
export class TypeNotSupportedError extends Error {
  constructor() {
    super('The type provided is not suported as a default operator')
    this.name = 'TypeNotSupportedError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TypeNotSupportedError)
    }
  }
}
