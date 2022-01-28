import makeSchema from '@packages/schema'

export default () => makeSchema({
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    fkCategory: {
      type: 'integer',
    },
    active: {
      type: 'boolean',
    },
    name: {
      type: 'string',
    },
  },
  required: [
    'fkCategory',
    'name',
  ],
  additionalProperties: false,
})
