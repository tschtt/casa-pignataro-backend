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
    
    testQuery({
      method: 'findMany',
      before: 'SELECT * FROM `test`',
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
    
    testQuery({
      method: 'findOne',
      before: 'SELECT * FROM `test`',
      after: 'LIMIT 1'
    })
    
  })

  function checkQuery(sql, { nth = 0 } = {}) {
    expect(format(...database.query.mock.calls[nth])).to.equals(sql)
  }

  function testQuery({ method, before, after }) {

    function checkQuery(query, { nth = 0 } = {}) {
      let sql = []

      if(before) sql.push(before)
      if(query) sql.push(query)
      if(after) sql.push(after)

      sql = sql.join(' ')
      
      expect(format(...database.query.mock.calls[nth])).to.equals(sql)
    }

    describe('and it recibes a query object', () => {
      // Reference: https://docs.mongodb.com/manual/reference/operator/query/

      describe('but it is empty', () => {
        
        it('selects all rows from the table', async () => {
          await table[method]({})
          checkQuery()
        })

      })

      describe('and it has a column propertie set', () => {

        it('selects all rows from the table', async () => {
          await table[method]({ id: {}, code: {} })
          checkQuery()
        })

        describe('and it has an $eq propertie set', () => {
          
          it('selects al rows equal to it', async () => {
            await table[method]({ id: { $eq: 1 }, code: { $eq: 'hola' } })
            checkQuery("WHERE `id` LIKE 1 AND `code` LIKE 'hola'")
          })
          
        })
  
        describe('and it has an $ne propertie set', () => {
          
          it('selects all rows not equal to it', async () => {
            await table[method]({ id: { $ne: 1 }})
            checkQuery("WHERE `id` NOT LIKE 1")
          })
          
        })
  
        describe('and it has an $gt propertie set', () => {
          
          it('selects all rows greater than it', async () => {
            await table[method]({ id: { $gt: 1 }})
            checkQuery("WHERE `id` > 1")
          })
          
        })
  
        describe('and it has an $gte propertie set', () => {
          
          it('selects all rows greater than or equal to it', async () => {
            await table[method]({ id: { $gte: 1 }})
            checkQuery("WHERE `id` >= 1")
          })
          
        })
  
        describe('and it has an $lt propertie set', () => {
          
          it('selects all rows lesser than to it', async () => {
            await table[method]({ id: { $lt: 1 }})
            checkQuery("WHERE `id` < 1")
          })
          
        })
        
        describe('and it has an $lte propertie set', () => {
          
          it('selects all rows lesser than or equal to it', async () => {
            await table[method]({ id: { $lte: 1 }})
            checkQuery("WHERE `id` <= 1")
          })
          
        })
        
        describe('and it has an $in array set', () => {
          
          it('selects all rows in it', async () => {
            await table[method]({ name: { $in: ['Ausnf', 'Sansfb', 'Aundi'] }})
            checkQuery("WHERE `name` IN ('Ausnf', 'Sansfb', 'Aundi')")
          })
          
        })
        
        describe('and it has an $nin propertie set', () => {
          
          it('selects all rows not in it', async () => {
            await table[method]({ name: { $nin: ['Ausnf', 'Sansfb', 'Aundi'] }})
            checkQuery("WHERE `name` NOT IN ('Ausnf', 'Sansfb', 'Aundi')")
          })
          
        })

        describe('and it has an $not propertie set with an expression', () => {
          
          describe('and it has an $eq propertie set with a primitive value', () => {
            
            it('selects al rows not equal to it', async () => {
              await table[method]({ id: { $not: { $eq: 1 } } })
              checkQuery("WHERE `id` NOT LIKE 1")
            })
            
          })
    
          describe('and it has an $ne propertie set', () => {
            
            it('selects all rows not equal to it', async () => {
              await table[method]({ id: { $not: { $ne: 1 } } })
              checkQuery("WHERE `id` LIKE 1")
            })
            
          })
    
          describe('and it has an $gt propertie set', () => {
            
            it('selects all rows greater than it', async () => {
              await table[method]({ id: { $not: { $gt: 1 } } })
              checkQuery("WHERE `id` <= 1")
            })
            
          })
    
          describe('and it has an $gte propertie set', () => {
            
            it('selects all rows greater than or equal to it', async () => {
              await table[method]({ id: { $not: { $gte: 1 } } })
              checkQuery("WHERE `id` < 1")
            })
            
          })
    
          describe('and it has an $lt propertie set', () => {
            
            it('selects all rows lesser than to it', async () => {
              await table[method]({ id: { $not: { $lt: 1 } } })
              checkQuery("WHERE `id` >= 1")
            })
            
          })
          
          describe('and it has an $lte propertie set', () => {
            
            it('selects all rows lesser than or equal to it', async () => {
              await table[method]({ id: { $not: { $lte: 1 } } })
              checkQuery("WHERE `id` > 1")
            })
            
          })
          
          describe('and it has an $in array set', () => {
            
            it('selects all rows in it', async () => {
              await table[method]({ name: { $not: { $in: ['Ausnf', 'Sansfb', 'Aundi'] } } })
              checkQuery("WHERE `name` NOT IN ('Ausnf', 'Sansfb', 'Aundi')")
            })
            
          })
          
          describe('and it has an $nin propertie set', () => {
            
            it('selects all rows not in it', async () => {
              await table[method]({ name: { $not: { $nin: ['Ausnf', 'Sansfb', 'Aundi'] } } })
              checkQuery("WHERE `name` IN ('Ausnf', 'Sansfb', 'Aundi')")
            })
            
          })
            
        })
          
      })

      describe('and it has an $and propertie set with an array of expressions', () => {

        it('selects the rows that match all expresions', async () => {
          await table[method]({ 
            $and: [
              { name: { $eq: 'Pedro' } },
              { code: { $lt : 20 }},
            ]
          })
          checkQuery("WHERE (`name` LIKE 'Pedro') AND (`code` < 20)")
        })
        
      })

      describe('and it has an $or propertie set', () => {

        it('selects the rows that match all expresions', async () => {
          await table[method]({ 
            $or: [
              { name: { $eq: 'Pedro' } },
              { code: { $lt : 20 }},
            ]
          })
          checkQuery("WHERE (`name` LIKE 'Pedro') OR (`code` < 20)")
        })
        
      })

      describe('and it has an $nor propertie set with an array of expressions', () => {

        it('selects the rows that dont match some of the expressions', async () => {
          await table[method]({ 
            $nor: [
              { name: { $eq: 'Pedro' } },
              { code: { $in : [20, 50, 37] }},
            ]
          })
          checkQuery("WHERE (`name` NOT LIKE 'Pedro') OR (`code` NOT IN (20, 50, 37))")
        })
        
      })

      describe('and it has an $nand propertie set with an array of expressions', () => {
        
        it('selects the rows that dont match some of the expressions', async () => {
          await table[method]({ 
            $nand: [
              { name: { $eq: 'Pedro' } },
              { code: { $in : [20, 50, 37] }},
            ]
          })
          checkQuery("WHERE (`name` NOT LIKE 'Pedro') AND (`code` NOT IN (20, 50, 37))")
        })
        
      })
      
    })

  }
  
})