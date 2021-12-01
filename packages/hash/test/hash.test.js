import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { mock } from './helpers/mock.js'

import useHash from '../src/hash.js'

const stringPlain = 'STRING.PLAIN'
const stringHashed = 'STRING.HASH'
const rounds = 5

describe('given the useHash(dependencies, options) package', () => {
  let bcrypt
  let hash

  beforeEach(() => {
    bcrypt = {
      hash: mock(() => Promise.resolve(stringHashed)),
      compare: mock(() => true),
    }

    hash = useHash({ bcrypt }, { rounds })
  })

  describe('and the make(plain, options) function is called', () => {
    it('passes the string to the hash function', async () => {
      await hash.make(stringPlain)
      expect(bcrypt.hash.mock.calls[0][0]).to.equals(stringPlain)
    })

    it('sets the the hash saltRounds to 10 by default', async () => {
      hash = useHash({ bcrypt })
      await hash.make(stringPlain)
      expect(bcrypt.hash.mock.calls[0][1]).to.equals(10)
    })

    it('returns the promise of a hashed string', async () => {
      const result = await hash.make(stringPlain)
      expect(result).to.equals(stringHashed)
    })

    describe('if useHash recibed an options object', () => {
      describe('and it has a rounds property', async () => {
        it('sets the hash saltRounds from it', async () => {
          await hash.make(stringPlain)
          expect(bcrypt.hash.mock.calls[0][1]).to.equals(rounds)
        })
      })
    })

    describe('if it recibes an options object', () => {
      describe('and it has a rounds property', () => {
        it('sets the hash saltRounds from it', async () => {
          const rounds = 20
          await hash.make(stringPlain, { rounds })
          expect(bcrypt.hash.mock.calls[0][1]).to.equals(rounds)
        })
      })
    })
  })

  describe('and the check(plain, hashed) function is called', () => {
    it('passes plain and hash to bcrypt.compare', async () => {
      await hash.check(stringPlain, stringHashed)
      expect(bcrypt.compare.mock.calls[0][0]).to.equals(stringPlain)
      expect(bcrypt.compare.mock.calls[0][1]).to.equals(stringHashed)
    })

    describe('and if plain and hash match', () => {
      it('returns true', async () => {
        bcrypt.compare.mock.returns = true
        const result = await hash.check(stringPlain, stringHashed)
        expect(result).to.equals(true)
      })
    })

    describe('and if plain and hash dont match', () => {
      it('returns false', async () => {
        bcrypt.compare.mock.returns = false
        const result = await hash.check(stringPlain, stringHashed)
        expect(result).to.equals(false)
      })
    })
  })
})
