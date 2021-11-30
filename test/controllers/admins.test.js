import { expect } from "chai";
import { mock } from '../_helpers/index.js'

import useAdmins from '../../src/admins/_controller.js'

describe('the admins controller', () => {
  
  let table
  let items
  let item
  let admins

  beforeEach(() => {

    items = [
      { id: 1, active: true,  username: 'santi', password: '123456' },
      { id: 2, active: true,  username: 'vicky', password: '654321' },
      { id: 3, active: false, username: 'pedro', password: '951753' },
    ]

    item = items[0]

    table = {
      // el quilombo de aca es para devolver una copia a los items, y no una referencia
      findMany: mock(() => Promise.resolve(items.map(item => ({ ...item })))),
      // idem lo de arriba
      findOne: mock(() => Promise.resolve({ ...item })),
      
      upsertOne: mock(() => Promise.resolve(1)),

      removeOne: mock(() => Promise.resolve(true))
    }
    
    admins = useAdmins({ table })
  })
  
  describe('when the findMany(query, options) method is called', () => {
    
    it('makes a call to table.findMany', async () => {
      await admins.findMany()
      expect(table.findMany.mock.calls.length).to.equals(1)
    })

    it('returns the array of admins with no password', async () => {
      const result = await admins.findMany()

      const expectedResult = items.map(item => {
        delete item.password
        return item
      })

      expect(result).to.deep.equals(expectedResult)
    })

    describe('and it recibes a query object', () => {
      
      it('passes it to table.findMany', async () => {
        const query = { name: { $eq: '%san%' } }
        await admins.findMany(query)
        expect(table.findMany.mock.calls[0][0]).to.deep.equals(query)
      })
      
    })
    
    describe('and it recibes an options object', () => {
      
      it('passes it to table.findMany', async () => {
        const options = { limit: 10 }
        await admins.findMany(null, options)
        expect(table.findMany.mock.calls[0][1]).to.deep.equals(options)
      })
      
      describe('and it has a hidePassword propertie set to false', () => {

        it('does not passes it to table.findMany', async () => {
          await admins.findMany(null, { hidePassword: false })
          expect(table.findMany.mock.calls[0][1]).to.not.have.property('hidePassword')
        })

        it('returns the array of admins with their password', async () => {
          const items = await admins.findMany({}, { hidePassword: false })
          items.forEach(item => {
            expect(item).to.have.property('password')
          })
        })
        
      })
      
    })
    
  })

  describe('when the findOne(query, options) method is called', () => {
    
    it('makes a call to table.findOne(query, options)', async () => {
      await admins.findOne()
      expect(table.findOne.mock.calls.length).to.equals(1)
    })

    it('returns the found admin without its password', async () => {
      const result = await admins.findOne()

      const expectedResult = item
      delete expectedResult.password
      
      expect(result).to.deep.equals(expectedResult)
    })

    describe('and it recibes a query object', () => {
      
      it('passes it to table.findOne', async () => {
        const query = { name: { $eq: '%san%' } }
        await admins.findOne(query)
        expect(table.findOne.mock.calls[0][0]).to.deep.equals(query)
      })
      
    })
    
    describe('and it recibes an options object', () => {
      
      it('passes it to table.findOne', async () => {
        const options = { limit: 10 }
        await admins.findOne(null, options)
        expect(table.findOne.mock.calls[0][1]).to.deep.equals(options)
      })
      
      describe('and it has a hidePassword propertie set to false', () => {

        it('does not passes it to table.findOne', async () => {
          await admins.findOne(null, { hidePassword: false })
          expect(table.findOne.mock.calls[0][1]).to.not.have.property('hidePassword')
        })

        it('returns the array of admins with their password', async () => {
          const item = await admins.findOne({}, { hidePassword: false })
          expect(item).to.have.property('password')
        })
        
      })
      
    })
    
  })

  describe("when the upsertOne(item, options) method is called", () => {

    it("calls table.upsertOne", async () => {
      const options = { offset: 5 }
      await admins.upsertOne(item, options)
      expect(table.upsertOne.mock.calls[0][0]).to.deep.equals(item)
      expect(table.upsertOne.mock.calls[0][1]).to.deep.equals(options)
    })

    it("returns its result", async () => {
      let result
      
      table.upsertOne.mock.returns = true
      result = await admins.upsertOne()
      expect(result).to.equals(true)

      table.upsertOne.mock.returns = false
      result = await admins.upsertOne()
      expect(result).to.equals(false)
    })

  })

  describe("when the removeOne(query, options) method is called", () => {

    it("calls table.removeOne", async () => {
      const query = { id: 1, username: { $like: 'hola' }}
      const options = { offset: 5 }

      await admins.removeOne(query, options)
      
      expect(table.removeOne.mock.calls[0][0]).to.equals(query)
      expect(table.removeOne.mock.calls[0][1]).to.equals(options)
    })

    it("returns its result", async () => {
      let result
      
      table.removeOne.mock.returns = true
      result = await admins.removeOne()
      expect(result).to.equals(true)

      table.removeOne.mock.returns = false
      result = await admins.removeOne()
      expect(result).to.equals(false)
    })
    
  })
  
})