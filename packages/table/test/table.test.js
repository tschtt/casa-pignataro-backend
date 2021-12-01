import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { format } from 'mysql2'
import { mock } from './helpers/mock.js'

import useBuilder from '../src/builder.js'
import useTable from '../src/table.js'

describe('the useTable(dependencies)({ name }) module', () => {
  // Data
  let rows; let fields; let
    name
  // Modules
  let connection; let
    builder
  // The table module
  let table

  beforeEach(() => {
    // Data
    rows = [
      { id: 1, active: true, code: 'AAA', name: 'Amsdn Uniasd', age: 22 },
      { id: 2, active: true, code: 'ABA', name: 'Uoane Posos', age: 54 },
      { id: 3, active: false, code: 'ABABA', name: 'Aobeu Ufhul', age: 47 },
    ]

    fields = []

    name = 'test'

    // Modules
    connection = {
      query: mock(() => [rows, fields]),
    }

    builder = useBuilder({ format })

    // The table module
    table = useTable({ connection, builder })(name)
  })

  describe('when the findMany(query, options) function is called', () => {
    it('selects all rows that match the query', async () => {
      await table.findMany()
      checkQuery('SELECT * FROM `test`')
    })

    it('returns them', async () => {
      const result = await table.findMany()
      expect(result).to.equals(rows)
    })
  })

  describe('when the findOne(query, options) function is called', () => {
    it('selects the first row that matches the query', async () => {
      await table.findOne()
      checkQuery('SELECT * FROM `test` LIMIT 1')
    })

    it('returns it', async () => {
      const result = await table.findOne()
      expect(result).to.equals(rows[0])
    })
  })

  describe('when the insertMany(data, options) function is called', () => {
    it('inserts an array of items to the table with the columns set from the first item', async () => {
      await table.insertMany([
        { id: 1, name: 'santi' },
        { id: 2, name: 'vicky' },
      ])
      checkQuery("INSERT INTO `test` (`id`, `name`) VALUES (1, 'santi'), (2, 'vicky')")
    })

    it('returns the id of the first inserted row', async () => {
      connection.query.mock.returns = [{ insertId: 3 }]
      const result = await table.insertMany([
        { id: 1, name: 'santi' },
        { id: 2, name: 'vicky' },
      ])
      expect(result).to.equals(3)
    })
  })

  describe('when the insertOne(data, options) function is called', () => {
    it('interts a row to the table with the data provided', async () => {
      await table.insertOne({ id: 1, name: 'santi' })
      checkQuery("INSERT INTO `test` (`id`, `name`) VALUES (1, 'santi')")
    })

    it("returns the row's id", async () => {
      connection.query.mock.returns = [{ insertId: 12 }]
      const result = await table.insertOne({ id: 1, name: 'santi' })
      expect(result).to.equals(12)
    })
  })

  describe('when the updateMany(query, data, options) function is called', () => {
    it('updates the matched rows with the data provided', async () => {
      await table.updateMany({ email: { $like: 'gmail' } }, { active: false })
      checkQuery("UPDATE `test` SET `active` = false WHERE `email` LIKE '%gmail%'")
    })

    it('returns the number of updated rows', async () => {
      connection.query.mock.returns = [{ affectedRows: 5 }]
      const result = await table.updateMany({ email: { $like: 'gmail' } }, { active: false })
      expect(result).to.equals(5)
    })
  })

  describe('when the updateOne(query, data, options) function is called', () => {
    it('updates the first row matched with the data provided', async () => {
      await table.updateOne({ email: { $like: 'gmail' } }, { active: false })
      checkQuery("UPDATE `test` SET `active` = false WHERE `email` LIKE '%gmail%' LIMIT 1")
    })

    it('returns true if a row was updated', async () => {
      connection.query.mock.returns = [{ affectedRows: 1 }]
      const result = await table.updateOne({ email: { $like: 'gmail' } }, { active: false })
      expect(result).to.equals(true)
    })

    it('returns false it no row was updated', async () => {
      connection.query.mock.returns = [{ affectedRows: 0 }]
      const result = await table.updateOne({ email: { $like: 'gmail' } }, { active: false })
      expect(result).to.equals(false)
    })
  })

  describe('when the upsertOne(data, options) function is called', () => {
    describe('and data.id truthy', () => {
      it('updates the first row that matches its id with the data provided', async () => {
        await table.upsertOne({ id: 5, username: 'peasd', email: 'arebw@amwn.omc' })
        checkQuery("UPDATE `test` SET `username` = 'peasd', `email` = 'arebw@amwn.omc' WHERE `id` LIKE 5 LIMIT 1")
      })

      describe('if a row was matched', () => {
        it('returns its id', async () => {
          connection.query.mock.returns = [{ affectedRows: 1 }]
          const result = await table.upsertOne({ id: 5, username: 'peasd', email: 'arebw@amwn.omc' })
          expect(result).to.equals(5)
        })
      })

      describe('if no row was matched', () => {
        it('inserts the data to a new row', async () => {
          connection.query.mock.returns = [{ affectedRows: 0 }]
          await table.upsertOne({ id: 5, username: 'peasd', email: 'arebw@amwn.omc' })
          checkQuery("INSERT INTO `test` (`username`, `email`) VALUES ('peasd', 'arebw@amwn.omc')", { nth: 1 })
        })

        it('returns its id', async () => {
          connection.query.mock.returns = [{ affectedRows: 0, insertId: 3 }]
          const result = await table.upsertOne({ id: 5, username: 'peasd', email: 'arebw@amwn.omc' })
          expect(result).to.equals(3)
        })
      })
    })

    describe('and data.id is falsy', () => {
      it('inserts the data to a new row', async () => {
        connection.query.mock.returns = [{ insertId: 10 }]
        await table.upsertOne({ id: 0, username: 'peasd', email: 'arebw@amwn.omc' })
        checkQuery("INSERT INTO `test` (`username`, `email`) VALUES ('peasd', 'arebw@amwn.omc')")
      })

      it('returns its result', async () => {
        connection.query.mock.returns = [{ insertId: 10 }]
        const result = await table.upsertOne({ id: 0, username: 'peasd', email: 'arebw@amwn.omc' })
        expect(result).to.equals(10)
      })
    })
  })

  describe('when the removeMany(query, options) function is called', () => {
    it('removes all matched rows from the table', async () => {
      await table.removeMany({ name: 'santi' })
      checkQuery("DELETE FROM `test` WHERE `name` LIKE 'santi'")
    })

    it('returns the number of rows removed', async () => {
      connection.query.mock.returns = [{ affectedRows: 2 }]
      const result = await table.removeMany({ fkAdmin: 1 })
      expect(result).to.equals(2)
    })
  })

  describe('when the removeOne(query, options) function is called', () => {
    it('removes the first matched row from the table', async () => {
      await table.removeOne({ name: 'santi' })
      checkQuery("DELETE FROM `test` WHERE `name` LIKE 'santi' LIMIT 1")
    })

    it('returns true if a row was removed', async () => {
      connection.query.mock.returns = [{ affectedRows: 1 }]
      const result = await table.removeOne({ fkAdmin: 1 })
      expect(result).to.equals(true)
    })

    it('returns false if no row was removed', async () => {
      connection.query.mock.returns = [{ affectedRows: 0 }]
      const result = await table.removeOne({ fkAdmin: 1 })
      expect(result).to.equals(false)
    })
  })

  function checkQuery(sql, { nth = 0 } = {}) {
    expect(format(...connection.query.mock.calls[nth])).to.equals(sql)
  }
})
