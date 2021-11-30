import { expect } from "chai";
import { mock } from '../_helpers/index.js'

import useEndpoint from '../../src/admins/_endpoint.js'

describe("the admins endpoint", () => {

  let items
  let request 
  let controller
  let endpoint

  beforeEach(() => {
    items = [
      { id: 1, active: true,  username: 'Pedro', email: 'pepes@gmail.com' },
      { id: 1, active: true,  username: 'Panag', email: 'panas@yahoo.com' },
      { id: 1, active: false, username: 'Sanec', email: 'saneg@yahoo.com' },
    ]

    request = {
      params: {},
      query: {},
      body: {},
    }
    
    controller = {
      findMany: mock(() => Promise.resolve(items)),
      findOne: mock(() => Promise.resolve(items[0])),
      upsertOne: mock(() => Promise.resolve(items[0].id)),
      removeOne: mock(() => Promise.resolve(true)),
    }

    endpoint = useEndpoint({ controller })
  })
  
  describe("when the findMany method is called", () => {

    it("calls controller.findMany(query, options)", async () => {
      await endpoint.findMany({ request })
      expect(controller.findMany.mock.calls.length).to.equals(1)
    })

    it("passes it its query its options", async () => {
      request.query = { id: '1', only: 'id, username', orderBy: 'username', order: 'DESC', limit: '5', offset: '2' }

      await endpoint.findMany({ request })

      expect(controller.findMany.mock.calls[0][0]).to.deep.equals({
        id: '1'
      })

      expect(controller.findMany.mock.calls[0][1]).to.deep.equals({
        only: ['id', 'username'],
        orderBy: 'username',
        order: 'DESC',
        limit: 5,
        offset: 2,
      })

    })

    it("returns a success property and controller.findMany's result", async () => {
      const result = await endpoint.findMany({ request })
      expect(result).to.deep.equals({ success: true, items })
    })
    
  })

  describe("when the findOne method is called", () => {
    
    it("calls controller.findOne(query, options)", async () => {
      await endpoint.findOne({ request })
      expect(controller.findOne.mock.calls.length).to.equals(1)
    })

    it("passes it its query its options", async () => {
      request.params.id = '5'
      request.query = { id: '1', username: 'pedro', only: 'id, username', orderBy: 'username', order: 'DESC', limit: '5', offset: '2' }

      await endpoint.findOne({ request })

      expect(controller.findOne.mock.calls[0][0]).to.deep.equals({
        id: 5,
        username: 'pedro',
      })

      expect(controller.findOne.mock.calls[0][1]).to.deep.equals({
        only: ['id', 'username'],
        orderBy: 'username',
        order: 'DESC',
        limit: 5,
        offset: 2,
      })

    })

    it("returns a success property and controller.findMany's result", async () => {
      const result = await endpoint.findOne({ request })
      expect(result).to.deep.equals({ success: true, item: items[0] })
    })

  })

  describe("when the upsertOne method is called", () => {

    it("calls controller.upsertOne(item, options)", async () => {
      await endpoint.upsertOne({ request })
      expect(controller.upsertOne.mock.calls.length).to.equals(1)
    })
    
    it("passes its body and id param to upsert", async () => {
      request.params.id = '55'
      request.body = { id: 10, username: 'pedro', email: 'gomez' }
      
      await endpoint.upsertOne({ request })
      
      expect(controller.upsertOne.mock.calls[0][0]).to.deep.equals({
        id: 55,
        username: 'pedro',
        email: 'gomez',
      })
    })

    it("calls controller.findOne with the id returned from upsertOne", async () => {
      controller.upsertOne.mock.returns = 5
      await endpoint.upsertOne({ request })
      expect(controller.findOne.mock.calls[0][0]).to.deep.equals({ id: 5 })
    })

    it("returns a success property and the upserted item", async () => {
      const result = await endpoint.upsertOne({ request })
      expect(result).to.deep.equals({ success: true, item: items[0] })
    })
    
    describe("if the body contains a password", () => {
      
      it("does not pass it to upsert", async () => {
        request.params.id = '55'
        request.body = { id: 10, username: 'pedro', email: 'gomez', password: '123456' }
        
        await endpoint.upsertOne({ request })
        
        expect(controller.upsertOne.mock.calls[0][0]).to.deep.equals({
          id: 55,
          username: 'pedro',
          email: 'gomez',
        })
      })
      
    })
    
  })

  describe("when the removeOne method is called", () => {

    it("calls controller.removeOne with its request query and id", async () => {
      request.params.id = '5'
      request.query = { id: '1', username: 'pedro', orderBy: 'username', order: 'DESC', offset: '2' }

      await endpoint.removeOne({ request })

      expect(controller.removeOne.mock.calls[0][0]).to.deep.equals({
        id: 5,
        username: 'pedro',
      })

      expect(controller.removeOne.mock.calls[0][1]).to.deep.equals({
        limit: undefined,
        only: undefined,
        orderBy: 'username',
        order: 'DESC',
        offset: 2,
      })
    })

    it("return a success and removed properties", async () => {
      let result
      
      controller.removeOne.mock.returns = Promise.resolve(true)
      result = await endpoint.removeOne({ request })
      expect(result).to.deep.equals({ success: true, removed: true })

      controller.removeOne.mock.returns = Promise.resolve(false)
      result = await endpoint.removeOne({ request })
      expect(result).to.deep.equals({ success: true, removed: false })
    })
    
  })
  
})