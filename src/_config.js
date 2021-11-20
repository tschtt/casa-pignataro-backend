import dotenv from 'dotenv'
dotenv.config()

class EnvVariableMissingError extends Error {
  constructor(name) {
    super(`Falta definir la variable de entorno ${name}`)
    this.name = 'EnvVariableMissingError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, EnvVariableMissingError)
    }
  }
}

const vars = [
  'APP_PORT',
  'APP_URL',
]

vars.forEach(name => {
  if(!process.env[name])
    throw new EnvVariableMissingError(name)
})

