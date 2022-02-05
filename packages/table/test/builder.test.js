import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'

import { format } from 'mysql2'

import useBuilder from '../src/builder.js'

describe('the useBuilder(dependencies)(expression, options) module', () => {
  let builder

  beforeEach(() => {
    builder = useBuilder({ format })
  })

  it('Describe the functionality', () => {
    const result = builder({
      $select: {
        from: {
          $select: { table: 'article', only: ['article.id'] },
          $join: [
            { type: 'left', table: 'nn_article_attribute_value', on: 'nn_article_attribute_value.fkArticle', equals: 'article.id' },
          ],
          $group: 'article.id',
        },
        as: 'a',
      },
      $join: [
        { type: 'left', table: 'article', on: 'a.id', equals: 'article.id' },
        { type: 'left', table: 'nn_article_attribute_value', on: 'nn_article_attribute_value.fkArticle', equals: 'article.id' },
      ],
      $limit: {
        amount: 4,
      },
    })

    expect(result).to.equal('SELECT * FROM (SELECT `article`.`id` FROM `article` LEFT JOIN `nn_article_attribute_value` ON `nn_article_attribute_value`.`fkArticle` = `article`.`id` GROUP BY `article`.`id`) AS `a` LEFT JOIN `article` ON `a`.`id` = `article`.`id` LEFT JOIN `nn_article_attribute_value` ON `nn_article_attribute_value`.`fkArticle` = `article`.`id` LIMIT 4')
  })

  describe('when the expression contains a $select: { table?, from?, as?, only?, count? } operation', () => {

    describe('and it recibes a table string', () => {

      it('returns a select query for it', () => {
        const result = builder({ $select: { table: 'admin' } })
        expect(result).to.equals('SELECT * FROM `admin`')
      })

    })

    describe('and it recibes a from expression and an as value', () => {

      it('returns a select query for it', () => {
        const result = builder({
          $select: {
            from: {
              $select: { table: 'article' },
              $where: {
                id: { $gt: 1 },
              },
            },
            as: 'article',
          },
        })

        expect(result).to.equals('SELECT * FROM (SELECT * FROM `article` WHERE `id` > 1) AS `article`')
      })

    })

    describe('and it contains a only array', () => {
      it('selects only the specified columns', () => {
        const result = builder({ $select: { table: 'admin_session', only: ['id', 'active'] } })
        expect(result).to.equals('SELECT `id`, `active` FROM `admin_session`')
      })
    })

    describe('and it contains a count array', () => {
      it('counts the selected columns', () => {
        const result = builder({ $select: { table: 'admin_session', count: 'id' } })
        expect(result).to.equals('SELECT COUNT(`id`) FROM `admin_session`')
      })
    })
  })

  describe('when the expression contains a $join operation', () => {

    describe('and it is an object', () => {

      it('returns a join statement', () => {
        const result = builder({ $join: { type: 'left', table: 'test', on: 'a.id', equals: 'b.id' } })
        expect(result).to.equals('LEFT JOIN `test` ON `a`.`id` = `b`.`id`')
      })

    })

    describe('and it is an array', () => {

      it('returns a join statement', () => {

        const result = builder({
          $join: [
            { table: 'test_a', on: 'test_a.id', equals: 'test_c.id' },
            { type: 'right', table: 'test_b', on: 'test_b.id', equals: 'test_b.id' },
            { type: 'inner', table: 'test_c', on: 'test_c.id', equals: 'test_a.id' },
          ],
        })

        expect(result).to.equals('INNER JOIN `test_a` ON `test_a`.`id` = `test_c`.`id` RIGHT JOIN `test_b` ON `test_b`.`id` = `test_b`.`id` INNER JOIN `test_c` ON `test_c`.`id` = `test_a`.`id`')
      })

    })

  })

  describe('when the expression contains an $insert: { table, rows, columns? } operation', () => {
    it('returns an insert query', () => {
      const resultA = builder({ $insert: { table: 'admin', values: [{ id: 1, code: '123', name: 'Ounasbew Amainewb' }] } })
      const resultB = builder({ $insert: { table: 'admin', value: { id: 1, code: '123', name: 'Ounasbew Amainewb' } } })
      expect(resultA).to.equals("INSERT INTO `admin` (`id`, `code`, `name`) VALUES (1, '123', 'Ounasbew Amainewb')")
      expect(resultB).to.equals("INSERT INTO `admin` (`id`, `code`, `name`) VALUES (1, '123', 'Ounasbew Amainewb')")
    })
  })

  describe('when the expression contains a $update: { table, set } operation', () => {
    it('returns an update query', () => {
      const result = builder({ $update: { table: 'admin', set: { email: 'newmail@mailer.com', username: 'newname' } } })
      expect(result).to.equals("UPDATE `admin` SET `email` = 'newmail@mailer.com', `username` = 'newname'")
    })
  })

  describe('when the expression contains an $remove: { table } operation', () => {
    it('returns an delete query', () => {
      const result = builder({ $delete: { table: 'admin' } })
      expect(result).to.equals('DELETE FROM `admin`')
    })
  })

  describe('when the expression contains a $where: expression operation', () => {
    describe('and the expression contains a [column]: value', () => {
      describe('and the value is a string', () => {
        it('matches all rows equal to it ($eq operator)', () => {
          const result = builder({ $where: { name: 'santiago' } })
          expect(result).to.equals("WHERE `name` LIKE 'santiago'")
        })
      })

      describe('and the value is a number', () => {
        it('matches all rows equal to it ($eq operator)', () => {
          const result = builder({ $where: { id: 1 } })
          expect(result).to.equals('WHERE `id` LIKE 1')
        })
      })

      describe('and the value is a boolean', () => {
        it('matches all rows equal to it ($eq operator)', () => {
          const result = builder({ $where: { active: true } })
          expect(result).to.equals('WHERE `active` LIKE true')
        })
      })

      describe('and the value is an array', () => {
        it('matches all rows equal to one in the array ($in operator)', async () => {
          const result = builder({ $where: { name: ['santi', 'vicky'] } })
          expect(result).to.equals("WHERE `name` IN ('santi', 'vicky')")
        })
      })
    })

    describe('and the expression contains a [column]: expression operation', () => {
      describe('and it has a $like propertie set', () => {
        it('matches all rows that contains it', () => {
          const result = builder({ $where: { name: { $like: 's' } } })
          expect(result).to.equals("WHERE `name` LIKE '%s%'")
        })
      })

      describe('and it has an $eq propertie set', () => {
        it('matches all rows equal to it', () => {
          const result = builder({ $where: { id: { $eq: 1 }, code: { $eq: 'hola' } } })
          expect(result).to.equals("WHERE `id` LIKE 1 AND `code` LIKE 'hola'")
        })
      })

      describe('and it has an $ne propertie set', () => {
        it('matches all rows not equal to it', () => {
          const result = builder({ $where: { id: { $ne: 1 } } })
          expect(result).to.equals('WHERE `id` NOT LIKE 1')
        })
      })

      describe('and it has an $gt propertie set', () => {
        it('matches all rows greater than it', () => {
          const result = builder({ $where: { id: { $gt: 1 } } })
          expect(result).to.equals('WHERE `id` > 1')
        })
      })

      describe('and it has an $gte propertie set', () => {
        it('matches all rows greater than or equal to it', () => {
          const result = builder({ $where: { id: { $gte: 1 } } })
          expect(result).to.equals('WHERE `id` >= 1')
        })
      })

      describe('and it has an $lt propertie set', () => {
        it('matches all rows lesser than to it', () => {
          const result = builder({ $where: { id: { $lt: 1 } } })
          expect(result).to.equals('WHERE `id` < 1')
        })
      })

      describe('and it has an $lte propertie set', () => {
        it('matches all rows lesser than or equal to it', () => {
          const result = builder({ $where: { id: { $lte: 1 } } })
          expect(result).to.equals('WHERE `id` <= 1')
        })
      })

      describe('and it has an $in array set', () => {
        it('matches all rows in it', () => {
          const result = builder({ $where: { name: { $in: ['Ausnf', 'Sansfb', 'Aundi'] } } })
          expect(result).to.equals("WHERE `name` IN ('Ausnf', 'Sansfb', 'Aundi')")
        })
      })

      describe('and it has an $nin propertie set', () => {
        it('matches all rows not in it', () => {
          const result = builder({ $where: { name: { $nin: ['Ausnf', 'Sansfb', 'Aundi'] } } })
          expect(result).to.equals("WHERE `name` NOT IN ('Ausnf', 'Sansfb', 'Aundi')")
        })
      })

      describe('and it has an $not propertie set with an expression', () => {
        describe('and it has an $eq propertie set with a primitive value', () => {
          it('matches al rows not equal to it', () => {
            const result = builder({ $where: { id: { $not: { $eq: 1 } } } })
            expect(result).to.equals('WHERE `id` NOT LIKE 1')
          })
        })

        describe('and it has an $ne propertie set', () => {
          it('matches all rows not equal to it', () => {
            const result = builder({ $where: { id: { $not: { $ne: 1 } } } })
            expect(result).to.equals('WHERE `id` LIKE 1')
          })
        })

        describe('and it has an $gt propertie set', () => {
          it('matches all rows greater than it', () => {
            const result = builder({ $where: { id: { $not: { $gt: 1 } } } })
            expect(result).to.equals('WHERE `id` <= 1')
          })
        })

        describe('and it has an $gte propertie set', () => {
          it('matches all rows greater than or equal to it', () => {
            const result = builder({ $where: { id: { $not: { $gte: 1 } } } })
            expect(result).to.equals('WHERE `id` < 1')
          })
        })

        describe('and it has an $lt propertie set', () => {
          it('matches all rows lesser than to it', () => {
            const result = builder({ $where: { id: { $not: { $lt: 1 } } } })
            expect(result).to.equals('WHERE `id` >= 1')
          })
        })

        describe('and it has an $lte propertie set', () => {
          it('matches all rows lesser than or equal to it', () => {
            const result = builder({ $where: { id: { $not: { $lte: 1 } } } })
            expect(result).to.equals('WHERE `id` > 1')
          })
        })

        describe('and it has an $in array set', () => {
          it('matches all rows in it', () => {
            const result = builder({ $where: { name: { $not: { $in: ['Ausnf', 'Sansfb', 'Aundi'] } } } })
            expect(result).to.equals("WHERE `name` NOT IN ('Ausnf', 'Sansfb', 'Aundi')")
          })
        })

        describe('and it has an $nin propertie set', () => {
          it('matches all rows not in it', () => {
            const result = builder({ $where: { name: { $not: { $nin: ['Ausnf', 'Sansfb', 'Aundi'] } } } })
            expect(result).to.equals("WHERE `name` IN ('Ausnf', 'Sansfb', 'Aundi')")
          })
        })
      })

      describe('if the expression is empty', () => {
        it('returns an empty string', () => {
          const result = builder({ $where: { id: {}, code: {} } })
          expect(result).to.equals('')
        })
      })
    })

    describe('and the expression contains an $and: [expressions] operation', () => {
      it('matches the rows that match all expresions', () => {
        const result = builder({ $where: {
          $and: [
            { name: { $eq: 'Pedro' } },
            { code: { $lt: 20 } },
          ],
        } })
        expect(result).to.equals("WHERE (`name` LIKE 'Pedro') AND (`code` < 20)")
      })
    })

    describe('and the expression contains an $or: [expressions] operation', () => {
      it('matches the rows that match all expresions', () => {
        const result = builder({ $where: {
          $or: [
            { name: { $eq: 'Pedro' } },
            { code: { $lt: 20 } },
          ],
        } })
        expect(result).to.equals("WHERE ((`name` LIKE 'Pedro') OR (`code` < 20))")
      })
    })

    describe('and the expression contains an $nor: [expressions] operation', () => {
      it('matches the rows that dont match some of the expressions', () => {
        const result = builder({ $where: {
          $nor: [
            { name: { $eq: 'Pedro' } },
            { code: { $in: [20, 50, 37] } },
          ],
        } })
        expect(result).to.equals("WHERE (`name` NOT LIKE 'Pedro') OR (`code` NOT IN (20, 50, 37))")
      })
    })

    describe('and the expression contains an $nand: [expressions] operation', () => {
      it('matches the rows that dont match some of the expressions', () => {
        const result = builder({ $where: {
          $nand: [
            { name: { $eq: 'Pedro' } },
            { code: { $in: [20, 50, 37] } },
          ],
        } })
        expect(result).to.equals("WHERE (`name` NOT LIKE 'Pedro') AND (`code` NOT IN (20, 50, 37))")
      })
    })
  })

  describe('when the expression contains a $limit: { amount, offset? } operation', () => {
    it('limits the result by the specified amount', () => {
      const result = builder({ $limit: { amount: 10 } })
      expect(result).to.equals('LIMIT 10')
    })

    describe('if an offset is defined', () => {
      it('offsets the result by the specified amount', () => {
        const result = builder({ $limit: { amount: 25, offset: 10 } })
        expect(result).to.equals('LIMIT 25 OFFSET 10')
      })
    })
  })

  describe('when the expression contains a $order: { by, sort? } operation', () => {
    it('orders the results by the specified column', () => {
      const result = builder({ $order: { by: 'active' } })
      expect(result).to.equals('ORDER BY `active`')
    })

    describe('if a sorting order is set', () => {
      it('sorts by the specified order', () => {
        let result

        result = builder({ $order: { by: 'active', sort: 'asc' } })
        expect(result).to.equals('ORDER BY `active` ASC')

        result = builder({ $order: { by: 'password', sort: 'ASC' } })
        expect(result).to.equals('ORDER BY `password` ASC')

        result = builder({ $order: { by: 'code', sort: 'desc' } })
        expect(result).to.equals('ORDER BY `code` DESC')

        result = builder({ $order: { by: 'date', sort: 'DESC' } })
        expect(result).to.equals('ORDER BY `date` DESC')
      })

      describe("if sort is set to anything other than 'asc', 'ASC', 'desc', or 'DESC'", () => {
        it('does not sorts the result', () => {
          const result = builder({ $order: { by: 'username', sort: 'asc;DROP TABLE `admin`;' } })
          expect(result).to.equals('ORDER BY `username`')
        })
      })
    })
  })
})
