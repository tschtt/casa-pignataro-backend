import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mysql from 'mysql2/promise'

const KEY = process.env.KEY

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7Ujm6Yhn2Wsx',
  database: 'casa_pignataro',
})

class UserNotFoundError extends Error {
  constructor() {
    super(`No se encontró el usuario`)
    this.name = 'UserNotFoundError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, UserNotFoundError)
    }
  }
}

class InvalidPasswordError extends Error {
  constructor() {
    super(`Contraseña invalida`)
    this.name = 'InvalidPasswordError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPasswordError)
    }
  }
}

class UnauthorizedError extends Error {
  constructor() {
    super('No tenes permisos para acceder a este recurso')
    this.name = 'UnauthorizedError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError)
    }
  }
}

async function auth(req, res, next) {
  try {
    let authorization = req.headers.authorization
  
    if(!authorization) {
      throw new UnauthorizedError()
    }

    authorization = authorization.split(' ')

    if(authorization[0] !== 'Bearer' || authorization[1].match(/\S+\.\S+\.\S+/) === null) {
      throw new UnauthorizedError()
    }

    authorization = jwt.verify(authorization[1], KEY)

    req.administrador = (await connection.execute('SELECT * FROM administrador WHERE id = ? LIMIT 1', [authorization.id]))[0][0]

    delete req.administrador.activo
    delete req.administrador.contraseña

    next()

  } catch (error) {
    switch (error.name) {
      case 'UnauthorizedError':
      case 'JsonWebTokenError':
        res.status(401).send({ success: false, message: 'No tenes permisos para acceder a este recurso' })
        break;
      default:
        console.log(error)
        res.status(500).send({ success: false, message: 'Error interno' })
        break;
    }
    
  }
}

const router = express.Router()

router.get('/administrador', auth, async (req, res) => {
  res.send({ success: true, item: req.administrador })
})

router.get('/', async (req, res) => {
  try {
    const usuario = req.query.usuario
    const contraseña = req.query.contraseña

    const administrador = (await connection.execute('SELECT * FROM administrador WHERE usuario = ? LIMIT 1', [usuario]))[0][0]

    if(!administrador) {
      throw new UserNotFoundError()
    }
    
    const password_valid = await bcrypt.compare(contraseña, administrador.contraseña)
    
    if(!password_valid) {
      throw new InvalidPasswordError()
    }
    
    const token = jwt.sign({ id: administrador.id }, KEY, { expiresIn: 1440 })
    
    res.send({
      success: true,
      token,
    })

  } catch (error) {
    switch (error.name) {
      case 'UserNotFoundError':
      case 'InvalidPasswordError':
        res.status(401).send({ success: false, message: error.message })
        break;
        default:
        console.log(error)
        res.status(500).send({ success: false, message: 'Error interno' })
        break;
    }
  }  
})

export default router