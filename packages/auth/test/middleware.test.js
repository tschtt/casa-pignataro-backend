import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import mock from './helpers/mock.js'

import { AuthenticationFailedError } from '../src/errors.js'
import useAdmin from '../src/middleware.js'

describe('the admin({ auth })(req, res, next) middleware', () => {
  // Data
  let token
  let payload
  let req; let res; let
    next
  // Modules
  let auth
  // The admin middleware
  let admin

  beforeEach(() => {
    // Data
    token = 'BASE.TOKEN.EXAMPLE'
    payload = { id: 5, type: 'access' }
    req = {
      headers: {
        authorization: `bearer ${token}`,
      },
    }
    res = {
      status: mock(() => this).bind(res),
      send: mock(),
    }
    next = mock()
    // Modules
    auth = {
      decode: mock(() => payload),
    }
    // Admin middleware
    admin = useAdmin({ auth })
  })

  it('decodes the token part from req.headers.authorization', () => {
    admin(req, res, next)
    expect(auth.decode.mock.calls[0][0]).to.equals(token)
  })

  it("adds the token's payload to req.auth.payload", () => {
    admin(req, res, next)
    expect(req.auth.payload).to.equals(payload)
  })

  it('calls the next function', () => {
    admin(req, res, next)
    expect(next.mock.calls.length).to.equals(1)
  })

  describe('if req.headers.authorization is undefined', () => {
    it("throws an AuthenticationFailedError with a message like 'No se pudo autenticar su pedido: el header authorization no esta definido'", () => {
      delete req.headers.authorization
      expect(() => admin(req, res, next)).to.throw(AuthenticationFailedError)
      expect(() => admin(req, res, next)).to.throw('No se pudo autenticar su pedido: el header authorization no esta definido')
    })
  })

  describe('if req.headers.authorization does not have an bearer "token" format', () => {
    it("throws an AuthenticationFailedError with a message like 'No se pudo autenticar su pedido: el encabezado de autorizacion no cumple con el formato requerido'", () => {
      req.headers.authorization = token
      expect(() => admin(req, res, next)).to.throw(AuthenticationFailedError)
      expect(() => admin(req, res, next)).to.throw('No se pudo autenticar su pedido: el encabezado de autorizacion no cumple con el formato requerido')
    })
  })

  describe('if the token is not valid', () => {
    it("throws an AuthenticationFailedError with a message like 'No se pudo autenticar su pedido: el token provisto no es valido'", () => {
      auth.decode = mock(() => { throw new Error() })
      expect(() => admin(req, res, next)).to.throw(AuthenticationFailedError)
      expect(() => admin(req, res, next)).to.throw('No se pudo autenticar su pedido: el token provisto no es valido')
    })
  })

  describe('if an AUTH_PAYLOAD_TYPE enviroment variable is set', () => {
    describe("and if the token's type is not equal to it", () => {
      it("throws an AuthenticationFailedError with a message like 'No se pudo autenticar su pedido: el token provisto no es valido'", () => {
        process.env.AUTH_PAYLOAD_TYPE = 'access'
        payload.type = 'session'
        expect(() => admin(req, res, next)).to.throw(AuthenticationFailedError)
        expect(() => admin(req, res, next)).to.throw('No se pudo autenticar su pedido: el token provisto no es valido')
      })
    })
  })
})
