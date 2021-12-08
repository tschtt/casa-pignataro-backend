import { BadRequestError, UnauthorizedError } from '../_errors.js'

export default ({ auth, hash, sessions, admins }) => ({

  async login(request) {
    const { username, password } = request.body

    if (!username) {
      throw new BadRequestError('Falta el nombre de usuario')
    }

    if (!password) {
      throw new BadRequestError('Falta la contraseña')
    }

    const user = await admins.findOne({ username })

    if (!user) {
      throw new BadRequestError('No se encontró el usuario')
    }

    if (!user.active) {
      throw new BadRequestError('El usuario se encuentra inactivo')
    }

    const match = await hash.check(password, user.password)

    if (!match) {
      throw new BadRequestError('La contraseña es incorrecta')
    }

    const accessToken = auth.generate({ id: user.id, type: 'access' }, { expiration: 900 })
    const refreshToken = auth.generate({ id: user.id, type: 'refresh' }, { expiration: 3600 })

    await sessions.removeMany({ fkAdmin: user.id })
    await sessions.insertOne({ fkAdmin: user.id, token: refreshToken })

    delete user.password

    return {
      success: true,
      accessToken,
      refreshToken,
      user,
    }
  },

  async logout(request) {
    const fkAdmin = request.auth.payload.id
    await sessions.removeMany({ fkAdmin })
    return {
      success: true,
      message: 'Se cerró la sesión',
    }
  },

  async refresh(request) {
    const { authorization } = request.headers

    const headerToken = authorization.split(' ')[1]

    const payload = auth.decode(headerToken)

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError()
    }

    const session = await sessions.findOne({ fkAdmin: payload.id })

    if (!session || session.token !== headerToken) {
      throw new UnauthorizedError()
    }

    const user = await admins.findOne({ id: payload.id })

    const accessToken = auth.generate({ id: payload.id, type: 'access' }, { expiration: 900 })
    const refreshToken = auth.generate({ id: payload.id, type: 'refresh' }, { expiration: 3600 })

    await sessions.removeMany({ fkAdmin: payload.id })
    await sessions.insertOne({ fkAdmin: payload.id, token: refreshToken })

    delete user.password

    return {
      success: true,
      accessToken,
      refreshToken,
      user,
    }
  },

})
