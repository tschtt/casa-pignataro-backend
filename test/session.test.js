import { expect } from 'chai'
import { test } from 'mocha'

import useSesionEndpoint from '../src/session/_endpoint.js'

import mock from './helpers/mock.js'
import throwsAsync from './helpers/throws-async.js'

describe('the session endpoint', () => {
  
  // Data
  let admin, request
  let token, accessToken, refreshToken

  // Packages
  let auth, hash
  
  // Table controllers
  let sessions, admins

  // The session endpoint
  let session
  
  beforeEach(() => {
    // Data    
    request = {
      query: {
        username: 'santi',
        password: '123456'
      }
    }

    admin = {
      id: 1,
      username: 'santi',
      password: '123456'
    }

    token = 'BASIC.TOKEN.EXAMPLE'
    accessToken = 'ACCESS.TOKEN.EXAMPLE'
    refreshToken = 'REFRESH.TOKEN.EXAMPLE'
 
    // Packages
    auth = {
      generate: mock((payload, options) => {
        switch (options.expiration) {
          case 900: return accessToken
          case 3600: return refreshToken
          default: return token
        }
      }),
      generateAccessToken: mock(() => accessToken),
      generateRefreshToken: mock(() => refreshToken),
    }

    hash = {
      check: mock(() => true)
    }

    // Table controllers
    sessions = {
      findOne: mock(() => { return { ...admin } }),
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
  
  describe('then login is called', () => {
    
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
        expect(hash.check.mock.calls[0][0]).to.equals(request.query.password)
        expect(hash.check.mock.calls[0][1]).to.equals(admin.password)
      })

      it('generates an access token with a duration of 15 minutes', async () => {
        await session.login({ request })
        expect(auth.generate.mock.calls[0][0]).to.deep.equals({ id: admin.id })
        expect(auth.generate.mock.calls[0][1]).to.deep.equals({ expiration: 900 })
      })

      it('generates a refresh token with a duration of one hour', async () => {        
        await session.login({ request })
        expect(auth.generate.mock.calls[1][0]).to.deep.equals({ id: admin.id })
        expect(auth.generate.mock.calls[1][1]).to.deep.equals({ expiration: 3600 })
      })

      it('deletes all sessions linked to the admin from the database', async () => {
        await session.login({ request })
        expect(sessions.removeMany.mock.calls[0][0]).to.deep.equals({ fkAdmin: admin.id })
      })

      it('saves the refresh token to the database', async () => {
        await session.login({ request })
        expect(sessions)
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
            query: { password: '123456' }
          }

          const request_no_password = {
            query: { username: 'santi' }
          }

          const request_empty = {
            query: {}
          }

          await throwsAsync('MissingDataError', () => session.login({ request: request_no_user }))
          await throwsAsync('MissingDataError', () => session.login({ request: request_no_password }))
          await throwsAsync('MissingDataError', () => session.login({ request: request_empty }))
      })

    })
    
  })
  
})