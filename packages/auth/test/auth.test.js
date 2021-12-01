import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import mock from './helpers/mock.js'

import { AuthenticationFailedError } from '../src/errors.js'

import useAuth from '../src/auth.js'

const key = 'JWT.TOKEN.KEY'
const token = 'JWT.TOKEN.EXAMPLE'
const algorithm = 'ALGO'
const expiration = 1600

describe('given the useAuth(dependencies, options) package', () => {
  let jwt
  let auth

  beforeEach(() => {
    jwt = {
      sign: mock(() => token),
      verify: mock(() => {}),
    }

    auth = useAuth(
      { jwt },
      { key, expiration, algorithm },
    )
  })

  describe('when the generate(payload, options) method is called', () => {
    it('signs a token with a payload', () => {
      const payload = { id: 666 }
      auth.generate(payload)
      expect(jwt.sign.mock.calls[0][0]).to.deep.equals(payload)
    })

    it("sets the token's secretOrPrivateKey from useAuth's options key", () => {
      auth.generate({ id: 1 })
      expect(jwt.sign.mock.calls[0][1]).to.equals(key)
    })

    it("sets the token's expiration time from useAuth's options", () => {
      auth.generate({ username: 'Pedro' })
      expect(jwt.sign.mock.calls[0][2]).to.have.property('expiresIn', expiration)
    })

    it("sets the token's algorithm from userAuth's options", () => {
      auth.generate({ username: 'Pedro' })
      expect(jwt.sign.mock.calls[0][2]).to.have.property('algorithm', algorithm)
    })

    it('returns a json web token', () => {
      const result = auth.generate({ id: 666 })
      expect(result).to.equal(token)
    })

    describe('if it recibes an options object', () => {
      describe('and it has a key property', () => {
        it("sets the token's secretOrPrivateKey with it", () => {
          const key = 'JWT.GENRATE.KEY'
          auth.generate({ id: 1000 }, { key })
          expect(jwt.sign.mock.calls[0][1]).to.equals(key)
        })
      })

      describe('and it has an expiration property', () => {
        it("sets the token's expiration time from it", () => {
          const expiration = 1000
          auth.generate({ code: 'A1H1' }, { expiration })
          expect(jwt.sign.mock.calls[0][2]).to.have.property('expiresIn', expiration)
        })
      })

      describe('and it has an algorithm property', () => {
        it("sets the token's algorithm from it", () => {
          const algorithm = 'OTRO'
          auth.generate({ code: 'H1N1' }, { algorithm })
          expect(jwt.sign.mock.calls[0][2]).to.have.property('algorithm', algorithm)
        })
      })
    })
  })

  describe('when the decode(token, options) method is called', () => {
    it("sets the verifiers's secretOrPrivateKey from useAuth's options", () => {
      auth.decode(token)
      expect(jwt.verify.mock.calls[0][1]).to.equals(key)
    })

    it("sets the verifier's algorithms from useAuth's options", () => {
      auth.decode(token)
      expect(jwt.verify.mock.calls[0][2]).to.have.deep.property('algorithms', [algorithm])
    })

    describe('and if the token is valid', () => {
      it("returns the decoded token's payload", async () => {
        jwt.verify.mock.returns = { id: 1, code: 'ABC' }
        const result = auth.decode(token)
        expect(result).to.equals(jwt.verify.mock.returns)
      })
    })

    describe('and if the token is invalid', () => {
      it("throws an AuthenticationFailedError with a message like 'No se pudo autenticar su pedido: el token provisto no es valido'", async () => {
        jwt.verify = mock(() => { throw new Error('Token Invalido') })
        expect(() => auth.decode(token)).to.throw(AuthenticationFailedError)
        expect(() => auth.decode(token)).to.throw('No se pudo autenticar su pedido: el token provisto no es valido')
      })
    })

    describe('and if it recibes an options object', () => {
      describe('and it has a key property', () => {
        it("sets the verifier's secretOrPrivateKey with it", () => {
          const key = 'JWT.GENRATE.KEY'
          auth.decode(token, { key })
          expect(jwt.verify.mock.calls[0][1]).to.equals(key)
        })
      })

      describe('and it has an algorithm property', () => {
        it("sets the verifier's algorithms from it", () => {
          const algorithm = 'OTRO'
          auth.decode(token, { algorithm })
          expect(jwt.verify.mock.calls[0][2]).to.have.deep.property('algorithms', [algorithm])
        })
      })
    })
  })
})
