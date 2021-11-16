import { expect } from 'chai'
import { mock } from '@taschetta/test'
import { format } from 'mysql2'
import useTable from '../src/_controller.js'

const rows = [
  { id: 1, active: true,  code: 'AAA',   name: 'Amsdn Uniasd', age: 22 },
  { id: 2, active: true,  code: 'ABA',   name: 'Uoane Posos', age: 54 },
  { id: 3, active: false, code: 'ABABA', name: 'Aobeu Ufhul', age: 47 },
]

const fields = []

const name = 'test'

describe('the useTable(dependencies)({ name }) module', () => {

  let database
  let table

  beforeEach(() => {
    database = {
      query: mock(() => [rows, fields]) 
    }
    
    table = useTable({ database })(name)
  })
  
  describe('when the findMany(query, options) function is called', () => {
    
    it('selects all rows from the table', async () => {
      await table.findMany()
      checkQuery('SELECT * FROM `test`')
    })
    
    it('returns an array of rows', async () => {
      const result = await table.findMany()
      expect(result).to.equals(rows)
    })

    describe('and it recibes a query object', () => {
      
      it('selects all rows from the table', async () => {
        await table.findMany({})
        checkQuery('SELECT * FROM `test`')
      })

      describe('and it has some fields object', () => {
        
        it('selects all rows from the table', async () => {
          await table.findMany({ id: {}, code: {} })
          checkQuery('SELECT * FROM `test`')
        })

        describe('and it has an $eq propertie set', () => {
          
          it('selects al rows with fields equal to $eq', async () => {
            await table.findMany({ id: { $eq: 1 }, code: { $eq: 'hola' } })
            checkQuery("SELECT * FROM `test` WHERE `id` like 1 AND `code` like 'hola'")
          })
          
        })
        
      })
      
    })
    
  })

  describe('when the findOne(query, options) function is called', () => {

    it('selects all rows from the table and limits it to one result', async () => {
      await table.findOne()
      checkQuery('SELECT * FROM `test` LIMIT 1')
    })

    it('returns the first row', async () => {
      const result = await table.findOne()
      expect(result).to.equals(rows[0])
    })
    
  })

  function checkQuery(sql) {
    expect(format(...database.query.mock.calls[0])).to.equals(sql)
  }
  
})