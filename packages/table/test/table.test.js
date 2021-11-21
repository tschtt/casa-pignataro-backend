import { expect } from 'chai'
import { mock } from './helpers/mock.js'
import { format } from 'mysql2'

import useBuilder from '../src/builder.js'
import useTable from '../src/table.js'


describe('the useTable(dependencies)({ name }) module', () => {
  
  // Data
  let rows, fields, name
  // Modules
  let connection, builder
  // The table module
  let table

  beforeEach(() => {
    // Data
    rows = [
      { id: 1, active: true,  code: 'AAA',   name: 'Amsdn Uniasd', age: 22 },
      { id: 2, active: true,  code: 'ABA',   name: 'Uoane Posos', age: 54 },
      { id: 3, active: false, code: 'ABABA', name: 'Aobeu Ufhul', age: 47 },
    ]  

    fields = []
    
    name = 'test'
    
    // Modules    
    connection = {
      query: mock(() => [rows, fields]) 
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

  describe('when the removeMany(query, options) function is called', () => {

    it('removes all rows from the table', async () => {
      await table.removeMany()
      checkQuery('DELETE FROM `test`')
    })
    
  })

  function checkQuery(sql, { nth = 0 } = {}) {
    expect(format(...connection.query.mock.calls[nth])).to.equals(sql)
  }
  
})