import makeSchema from '@packages/schema'

export default () => makeSchema({
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    fkAttribute: {
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
    'fkAttribute',
    'name',
  ],
  additionalProperties: false,
})
