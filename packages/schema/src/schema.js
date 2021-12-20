
export default ({ ajv }) => (schema) => {
  const validate = ajv.compile(schema)
  return {
    validateOne(data) {
      const valid = validate(data)
      if (!valid) {
        const error = validate.errors[0]

        const params = error.params
        const name = error.instancePath.split('/').filter((value) => !!value).join('.')

        console.log(error)

        switch (error.keyword) {
          case 'required':
            throw new ValidationError(`El campo ${params.missingProperty} es obligatorio`)
          case 'maxLength':
            throw new ValidationError(`El campo ${name} no puede superar los ${params.limit} caracteres`)
          case 'minLength':
            throw new ValidationError(`El campo ${name} no puede tener menos de ${params.limit} caracteres`)
          default:
            throw new ValidationError('Los datos ingresados son incorrectos')
        }
      }
      return true
    },
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
  }
}
