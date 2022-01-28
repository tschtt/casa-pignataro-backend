import makeSchema from '@packages/schema'

export default () => makeSchema({
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    fkSection: {
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
    'fkSection',
    'name',
  ],
  additionalProperties: false,
})
