import { expect } from 'chai'
import { test } from 'mocha'
import { AuthenticationFailedError } from '../packages/auth/src/errors.js'

import useSesionEndpoint from '../src/session/_endpoint.js'

import mock from './helpers/mock.js'
import throwsAsync from './helpers/throws-async.js'

describe('the session endpoint', () => {
  
  // Data
  let admin, request
  let token, accessToken, refreshToken
  let tokenPayload

  // Modules
  let auth, hash
  
  // Table controllers
  let sessions, admins

  // The session endpoint
  let session
  
  beforeEach(() => {
    // Data    
    admin = {
      id: 1,
      username: 'santi',
      password: '123456'
    }

    token = 'BASIC.TOKEN.EXAMPLE'
    accessToken = 'ACCESS.TOKEN.EXAMPLE'
    refreshToken = 'REFRESH.TOKEN.EXAMPLE'

    tokenPayload = { id: 5, type: 'refresh' }
 
    // Modules
    auth = {
      generate: mock((payload, options) => {
        switch (options.expiration) {
          case 900: return accessToken
          case 3600: return refreshToken
          default: return token
        }
      }),
      decode: mock(() => tokenPayload)
    }

    hash = {
      check: mock(() => true)
    }

    // Table controllers
    sessions = {
      findOne: mock(() => { return { fkAdmin: tokenPayload.id, token: refreshToken } }),
      removeMany: mock(),
      insertOne: mock(),
    }    

    admins = {
      findOne: mock(() => { return { ...admin } })
    }
    
    // The session endpoint
    session = useSesionEndpoint({ 
      auth, 
      hash, 
      admins, 
      sessions 
    })
  })
  
  describe('when the login endpoint is called', () => {

    let request
    
    beforeEach(() => {
      request = {
        body: {
          username: 'santi',
          password: '123456'
        }
      }
    })
    
    describe('and it recibes an username and password params', () => {

      it('finds an admin that matches the username passed', async () => {
        await session.login({ request })
        expect(admins.findOne.mock.calls[0][0]).to.deep.equal({ username: 'santi' })        
      })

      it('brings it with its password', async () => {
        await session.login({ request })
        expect(admins.findOne.mock.calls[0][1]).to.deep.equal({ hidePassword: false })
      })

      it("compares the passwords to see if they match", async () => {
        await session.login({ request })
        expect(hash.check.mock.calls[0][0]).to.equals(request.body.password)
        expect(hash.check.mock.calls[0][1]).to.equals(admin.password)
      })

      it('generates an access token with a duration of 15 minutes', async () => {
        await session.login({ request })
        expect(auth.generate.mock.calls[0][0]).to.deep.equals({ id: admin.id, type: 'access' })
        expect(auth.generate.mock.calls[0][1]).to.deep.equals({ expiration: 900 })
      })

      it('generates a refresh token with a duration of one hour', async () => {        
        await session.login({ request })
        expect(auth.generate.mock.calls[1][0]).to.deep.equals({ id: admin.id, type: 'refresh' })
        expect(auth.generate.mock.calls[1][1]).to.deep.equals({ expiration: 3600 })
      })

      it('deletes all sessions linked to the admin from the database', async () => {
        await session.login({ request })
        expect(sessions.removeMany.mock.calls[0][0]).to.deep.equals({ fkAdmin: admin.id })
      })

      it('saves the refresh token to the database', async () => {
        await session.login({ request })
        expect(sessions.insertOne.mock.calls[0][0]).to.deep.equals({ fkAdmin: admin.id, token: refreshToken })
      })

      it('returns the admin data (without the password), the access token and the reresh token', async () => {
        const result = await session.login({ request })        

        delete admin.password
        
        expect(result.success).to.equals(true)
        expect(result.admin).to.deep.equals(admin)
        expect(result.accessToken).to.equals(accessToken)
        expect(result.refreshToken).to.equals(refreshToken)
      })

      describe('if the admin is not found', () => {
        
        test('throws an InvalidUsernameError', async () => {
          admins.findOne.mock.returns = null
          await throwsAsync('InvalidUsernameError', () => session.login({ request }))
        })

      })

      describe('if the contraseñas do not match', () => {
        
        test('throws an InvalidPasswordError', async () => {
          hash.check.mock.returns = false
          await throwsAsync('InvalidPasswordError', () => session.login({ request }))
        })
        
      })
      
    })
    
    describe('if the username or password params are undefined', () => {
      
      test('throws a MissingDataError ', async () => {
          const request_no_user = {
            body: { password: '123456' }
          }

          const request_no_password = {
            body: { username: 'santi' }
          }

          const request_empty = {
            body: {}
          }

          await throwsAsync('MissingDataError', () => session.login({ request: request_no_user }))
          await throwsAsync('MissingDataError', () => session.login({ request: request_no_password }))
          await throwsAsync('MissingDataError', () => session.login({ request: request_empty }))
      })

    })
    
  })

  describe('when the logout endpoint is called', () => {
    
    let request

    beforeEach(() => {
      request = {
        auth: {
          payload: {
            id: 3,
            type: 'access'
          }
        }
      }
    })
    
    it('deletes all sessions linked to the logged admin', async () => {
      await session.logout({ request })
      expect(sessions.removeMany.mock.calls[0][0]).to.deep.equals({ fkAdmin: 3 })
    })

    it('returns a success message', async () => {
      const result = await session.logout({ request })        
      expect(result.success).to.equals(true)
      expect(result.message).to.equals('Se cerró la sesión')
    })
    
  })

  describe('when the refresh endpoint is called', () => {

    let request

    beforeEach(() => {
      request = {
        headers: {
          authorization: `Bearer ${refreshToken}`
        }
      }
    })
    
    it('decodes the token from the request header', async () => {
      await session.refresh({ request })
      expect(auth.decode.mock.calls[0][0]).to.equals(refreshToken)
    })

    it('brings the refresh token stored on the database', async () => {
      await session.refresh({ request })
      expect(sessions.findOne.mock.calls[0][0]).to.deep.equals({ fkAdmin: tokenPayload.id })
    })

    it('generates a new access token with a duration of 15 minutes', async () => {
      await session.refresh({ request })
      expect(auth.generate.mock.calls[0][0]).to.deep.equals({ id: tokenPayload.id, type: 'access' })
      expect(auth.generate.mock.calls[0][1]).to.deep.equals({ expiration: 900 })
    })

    it('generates a new refresh token with a duration of one hour', async () => {
      await session.refresh({ request })
      expect(auth.generate.mock.calls[1][0]).to.deep.equals({ id: tokenPayload.id, type: 'refresh' })
      expect(auth.generate.mock.calls[1][1]).to.deep.equals({ expiration: 3600 })
    })
    
    it("deletes all sessions linked to the admin's id", async () => {
      await session.refresh({ request })
      expect(sessions.removeMany.mock.calls[0][0]).to.deep.equals({ fkAdmin: tokenPayload.id })
    })

    it('saves the new refresh token to the database', async () => {
      await session.refresh({ request })
      expect(sessions.insertOne.mock.calls[0][0]).to.deep.equals({ fkAdmin: tokenPayload.id, token: refreshToken })
    })

    it('returns the new tokens', async () => {
      const result = await session.refresh({ request })
      expect(result.success).to.equals(true)
      expect(result.accessToken).to.equals(accessToken)
      expect(result.refreshToken).to.equals(refreshToken)
    })

    describe("if the request header's token is not valid", () => {
      
      it('throws an AuthenticationFailedError', async () => {
        auth.decode = mock(() => { throw new AuthenticationFailedError() })
        await throwsAsync('AuthenticationFailedError', () => session.refresh({ request }))
      })
      
    })

    describe("if the token's type is not refresh", () => {
      
      it('throws an UnauthorizedError', async () => {
        auth.decode.mock.returns = { id: 5, type: 'access' }
        await throwsAsync('UnauthorizedError', () => session.refresh({ request }))
      })
      
    })

    describe('if the database token is not found', () => {
      
      it('throws an UnauthorizedError', async () => {
        sessions.findOne.mock.returns = null
        await throwsAsync('UnauthorizedError', () => session.refresh({ request }))
      })
      
    })

    describe('if the tokens are different to each other', () => {

      it('throws an UnauthorizedError', async () => {
        sessions.findOne.mock.returns = { fkAdmin: 5, token: 'OTRO.TOKEN.DISTINTO' }
        await throwsAsync('UnauthorizedError', () => session.refresh({ request }))
      })
      
    })
    
  })
  
})