import { InvalidPasswordError, MissingDataError, InvalidUsernameError } from "../_errors.js"

export default ({ auth, hash, admins }) => ({

  async getSession({ request }) {    
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
    
    const accessToken = auth.generateAccessToken({ id: admin.id })
    const refreshToken = auth.generateRefreshToken({ id: admin.id })
    
    delete admin.password

    return {
      success: true,
      accessToken,
      refreshToken,
      admin,
    }
  },
  
})