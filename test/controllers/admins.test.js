import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { mock } from '../_helpers/index.js'

import useAdmins from '../../src/admins/_controller.js'

describe('the admins controller', () => {
  let table
  let items
  let item
  let admins

  beforeEach(() => {
    items = [
      { id: 1, active: true, username: 'santi', password: '123456' },
      { id: 2, active: true, username: 'vicky', password: '654321' },
      { id: 3, active: false, username: 'pedro', password: '951753' },
    ]

    item = items[0]

    table = {
      // el quilombo de aca es para devolver una copia a los items, y no una referencia
      findMany: mock(() => Promise.resolve(items.map((item) => ({ ...item })))),
      // idem lo de arriba
      findOne: mock(() => Promise.resolve({ ...item })),
      insertOne: mock(() => Promise.resolve(5)),
      updateOne: mock(() => Promise.resolve(3)),
      upsertOne: mock(() => Promise.resolve(1)),

      removeOne: mock(() => Promise.resolve(true)),
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

      const expectedResult = items.map((item) => {
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
          items.forEach((item) => {
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

  describe('when the insertOne(data, options) method is called', () => {
    it('calls table.insertOne and passes it its data with a default password', async () => {
      process.env.DEFAULT_PASSWORD = 'HOLA MUNDO'
      await admins.insertOne({ id: 1, username: 'asd' })
      expect(table.insertOne.mock.calls[0][0]).to.deep.equals({ id: 1, username: 'asd', password: 'HOLA MUNDO' })
    })

    it('returns the inserted id', async () => {
      table.insertOne.mock.returns = 10
      const result = await admins.insertOne({ id: 1, username: 'asd' })
      expect(result).to.deep.equals(10)
    })
  })

  describe('when the updateOne(query, data, options) method is called', () => {
    it('calls table.updateOne and passes it its query, data and options', async () => {
      await admins.updateOne({ id: 1 }, { username: 'jorge' })
      expect(table.updateOne.mock.calls[0][0]).to.deep.equals({ id: 1 })
      expect(table.updateOne.mock.calls[0][1]).to.deep.equals({ username: 'jorge' })
    })

    it('returns true of false depending if the row was updated', async () => {
      let result

      table.updateOne.mock.returns = true
      result = await admins.updateOne({ id: 1 }, { username: 'jorge' })
      expect(result).to.equals(true)

      table.updateOne.mock.returns = false
      result = await admins.updateOne({ id: 1 }, { username: 'jorge' })
      expect(result).to.equals(false)
    })

    describe('if the data to update contains a password', () => {
      it('removes it', async () => {
        await admins.updateOne({ id: 1 }, { password: 'asdasd' })
        expect(table.updateOne.mock.calls[0][1]).to.deep.equals({})
      })
    })
  })

  describe('when the upsertOne(item, options) method is called', () => {
    describe('and data.id truthy', () => {
      it('updates the first row that matches its id with the data provided', async () => {
        await admins.upsertOne({ id: 5, username: 'peasd', email: 'arebw@amwn.omc' })
        expect(table.updateOne.mock.calls[0][0]).to.deep.equals({ id: 5 })
        expect(table.updateOne.mock.calls[0][1]).to.deep.equals({ username: 'peasd', email: 'arebw@amwn.omc' })
      })

      describe('if a row was matched', () => {
        it('returns its id', async () => {
          table.updateOne.mock.returns = true
          const result = await admins.upsertOne({ id: 5, username: 'peasd', email: 'arebw@amwn.omc' })
          expect(result).to.equals(5)
        })
      })

      describe('if no row was matched', () => {
        it('inserts the data to a new row with a default password', async () => {
          process.env.DEFAULT_PASSWORD = '123'
          table.updateOne.mock.returns = 0
          await admins.upsertOne({ id: 5, username: 'peasd', email: 'arebw@amwn.omc' })
          expect(table.insertOne.mock.calls[0][0]).to.deep.equals({ username: 'peasd', email: 'arebw@amwn.omc', password: '123' })
        })

        it('returns its id', async () => {
          table.updateOne.mock.returns = 0
          table.insertOne.mock.returns = 3
          const result = await admins.upsertOne({ id: 5, username: 'peasd', email: 'arebw@amwn.omc' })
          expect(result).to.equals(3)
        })
      })
    })

    describe('and data.id is falsy', () => {
      it('inserts the data to a new row with a default password', async () => {
        process.env.DEFAULT_PASSWORD = '123'
        await admins.upsertOne({ id: 0, username: 'peasd', email: 'arebw@amwn.omc' })
        expect(table.insertOne.mock.calls[0][0]).to.deep.equals({ username: 'peasd', email: 'arebw@amwn.omc', password: '123' })
      })

      it('returns its result', async () => {
        table.insertOne.mock.returns = 3
        const result = await admins.upsertOne({ id: 0, username: 'peasd', email: 'arebw@amwn.omc' })
        expect(result).to.equals(3)
      })
    })
  })

  describe('when the removeOne(query, options) method is called', () => {
    it('calls table.removeOne', async () => {
      const query = { id: 1, username: { $like: 'hola' } }
      const options = { offset: 5 }

      await admins.removeOne(query, options)

      expect(table.removeOne.mock.calls[0][0]).to.equals(query)
      expect(table.removeOne.mock.calls[0][1]).to.equals(options)
    })

    it('returns its result', async () => {
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
