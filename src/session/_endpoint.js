import { InvalidPasswordError, MissingDataError, InvalidUsernameError, UnauthorizedError } from '../_errors.js'

export default ({ auth, hash, sessions, admins }) => ({

  async login({ request }) {
    const { username, password } = request.body

    if (!username || !password) {
      throw new MissingDataError()
    }

    const admin = await admins.findOne({ username }, { hidePassword: false })

    if (!admin) {
      throw new InvalidUsernameError()
    }

    const match = await hash.check(password, admin.password)

    if (!match) {
      throw new InvalidPasswordError()
    }

    const accessToken = auth.generate({ id: admin.id, type: 'access' }, { expiration: 900 })
    const refreshToken = auth.generate({ id: admin.id, type: 'refresh' }, { expiration: 3600 })

    await sessions.removeMany({ fkAdmin: admin.id })
    await sessions.insertOne({ fkAdmin: admin.id, token: refreshToken })

    delete admin.password

    return {
      success: true,
      accessToken,
      refreshToken,
      admin,
    }
  },

  async logout({ request }) {
    const fkAdmin = request.auth.payload.id
    await sessions.removeMany({ fkAdmin })
    return {
      success: true,
      message: 'Se cerró la sesión',
    }
  },

  async refresh({ request }) {
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

    const accessToken = auth.generate({ id: payload.id, type: 'access' }, { expiration: 900 })
    const refreshToken = auth.generate({ id: payload.id, type: 'refresh' }, { expiration: 3600 })

    await sessions.removeMany({ fkAdmin: payload.id })
    await sessions.insertOne({ fkAdmin: payload.id, token: refreshToken })

    return {
      success: true,
      accessToken,
      refreshToken,
    }
  },

})
