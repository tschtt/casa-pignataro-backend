import { InvalidPasswordError, MissingDataError, InvalidUsernameError } from "../_errors.js"

export default ({ auth, hash, sessions, admins }) => ({

  async login({ request }) {    
    const username = request.query.username
    const password = request.query.password

    if(!username || !password) {
      throw new MissingDataError()
    }

    const admin = await admins.findOne({ username }, { hidePassword: false })

    if(!admin) {
      throw new InvalidUsernameError()
    }
    
    const match = await hash.check(password, admin.password)
    
    if(!match) {
      throw new InvalidPasswordError()
    }
    
    const accessToken = auth.generate({ id: admin.id }, { expiration: 900 })
    const refreshToken = auth.generate({ id: admin.id }, { expiration: 3600 })

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
  
})