import { expect } from 'chai'
import { test } from 'mocha'

import useSesion from '../src/session/_endpoint.js'

import mock from './helpers/mock.js'
import throwsAsync from './helpers/throws-async.js'

const token = 'BASIC.TOKEN.EXAMPLE'
const accessToken = 'ACCESS.TOKEN.EXAMPLE'
const refreshToken = 'REFRESH.TOKEN.EXAMPLE'

const request = {
  query: {
    username: 'santi',
    password: '123456'
  }
}

describe('the sesion endpoint', () => {
  
  let auth
  let hash
  let admins
  let admin
  let sesion
  
  beforeEach(() => {
    auth = {
      generate: mock(() => token),
      generateAccessToken: mock(() => accessToken),
      generateRefreshToken: mock(() => refreshToken),
    }

    hash = {
      check: mock(() => true)
    }
    
    admin = {
      id: 1,
      username: 'santi',
      password: '123456'
    }

    admins = {
      findOne: mock(() => { return { ...admin } })
    }

    
    sesion = useSesion({ auth, hash, admins })
  })
  
  describe('then getSession is called', () => {
    
    describe('and it recibes an username and password params', () => {

      it('finds an admin that matches the username passed', async () => {
        await sesion.getSession({ request })
        expect(admins.findOne.mock.calls[0][0]).to.deep.equal({ username: 'santi' })        
      })

      it('brings it with its password', async () => {
        await sesion.getSession({ request })
        expect(admins.findOne.mock.calls[0][1]).to.deep.equal({ hidePassword: false })
      })

      it("compares the passwords to see if they match", async () => {
        await sesion.getSession({ request })
        expect(hash.check.mock.calls[0][0]).to.equals(request.query.password)
        expect(hash.check.mock.calls[0][1]).to.equals(admin.password)
      })

      it('generates an access token', async () => {
        await sesion.getSession({ request })
        expect(auth.generateAccessToken.mock.calls[0][0]).to.deep.equals({ id: admin.id })
      })

      it('generates a refresh token with a duration of one hour', async () => {        
        await sesion.getSession({ request })
        expect(auth.generateRefreshToken.mock.calls[0][0]).to.deep.equals({ id: admin.id })
      })

      it('returns the admin data (without the password), the access token and the reresh token', async () => {
        const result = await sesion.getSession({ request })        

        delete admin.password
        
        expect(result.success).to.equals(true)
        expect(result.admin).to.deep.equals(admin)
        expect(result.accessToken).to.equals(accessToken)
        expect(result.refreshToken).to.equals(refreshToken)
      })

      describe('if the admin is not found', () => {
        
        test('throws an InvalidUsernameError', async () => {
          admins.findOne.mock.returns = null
          await throwsAsync('InvalidUsernameError', () => sesion.getSession({ request }))
        })

      })

      describe('if the contraseñas do not match', () => {
        
        test('throws an InvalidPasswordError', async () => {
          hash.check.mock.returns = false
          await throwsAsync('InvalidPasswordError', () => sesion.getSession({ request }))
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

          await throwsAsync('MissingDataError', () => sesion.getSession({ request: request_no_user }))
          await throwsAsync('MissingDataError', () => sesion.getSession({ request: request_no_password }))
          await throwsAsync('MissingDataError', () => sesion.getSession({ request: request_empty }))
      })

    })
    
  })
  
})