import { expect } from 'chai'
import { test } from 'mocha'
import mock from './helpers/mock.js'
import throwsAsync from './helpers/throws-async.js'
import useSesion from '../src/sesion/endpoint.js'

const request = {
  query: {
    username: 'santi',
    password: '123456'
  }
}

const token = 'TOKEN.EXAMPLE'

const admin = {
  id: 1,
  username: 'santi',
  password: '123456'
}

describe('the sesion endpoint', () => {
  
  let auth
  let hash
  let admins
  let sesion
  
  beforeEach(() => {
    auth = {
      generate: mock(() => token)
    }

    hash = {
      check: mock(() => true)
    }
    
    admins = {
      findOne: mock(() => admin)
    }
    
    sesion = useSesion({ auth, hash, admins })
  })
  
  describe('then getSesion is called', () => {
    
    describe('and it recibes an username and password params', () => {

      it('finds an admin that matches the username passed', async () => {
        await sesion.getSesion({ request })
        expect(admins.findOne.mock.calls[0][0]).to.deep.equal({ username: 'santi' })        
      })

      it('brings it with its password', async () => {
        await sesion.getSesion({ request })
        expect(admins.findOne.mock.calls[0][1]).to.deep.equal({ hidePassword: false })
      })

      it("checks if the password matches admin's password", async () => {
        await sesion.getSesion({ request })
        expect(hash.check.mock.calls[0][0]).to.equals(request.query.password)
        expect(hash.check.mock.calls[0][1]).to.equals(admin.password)
      })

      it('signs the token with admin.id', async () => {
        await sesion.getSesion({ request })
        expect(auth.generate.mock.calls[0][0]).to.deep.equals({ id: admin.id })
      })

      it('returns an object with a success and token properties', async () => {
        const result = await sesion.getSesion({ request })        
        expect(result.success).to.equals(true)
        expect(result.token).to.equals(token)
      })

      describe('if the admin is not found', () => {
        
        test('throws an InvalidUsernameError', async () => {
          admins.findOne.mock.returns = null
          await throwsAsync('InvalidUsernameError', () => sesion.getSesion({ request }))
        })

      })

      describe('if the contraseñas do not match', () => {
        
        test('throws an InvalidPasswordError', async () => {
          hash.check.mock.returns = false
          await throwsAsync('InvalidPasswordError', () => sesion.getSesion({ request }))
        })
        
      })
      
    })
    
    describe('if the username or password params are undefined', () => {
      
      test('throws a MissingDataError ', async () => {
          const request_no_user = {
            query: { password: '123456' }
          }

          const request_no_password = {
            query: { username: 'santi' }
          }

          const request_empty = {
            query: {}
          }

          await throwsAsync('MissingDataError', () => sesion.getSesion({ request: request_no_user }))
          await throwsAsync('MissingDataError', () => sesion.getSesion({ request: request_no_password }))
          await throwsAsync('MissingDataError', () => sesion.getSesion({ request: request_empty }))
      })

    })
    
  })
  
})