import { InvalidPasswordError, MissingDataError, InvalidUsernameError } from "../_errors.js"

export default ({ auth, hash, admins }) => ({

  async getSesion({ request }) {    
    const username = request.query.username
    const password = request.query.password

    if(!username || !password) {
      throw new MissingDataError()
    }

    const administrador = await admins.findOne({ username }, { hidePassword: false })

    if(!administrador) {
      throw new InvalidUsernameError()
    }
    
    const match = await hash.check(password, administrador.password)
    
    if(!match) {
      throw new InvalidPasswordError()
    }
    
    const token = auth.generate({ id: administrador.id })

    return {
      success: true,
      token
    }
  },
  
})