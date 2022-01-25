import { makeSchema } from '@packages/schema'

export default () => makeSchema({
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    active: {
      type: 'boolean',
    },
    fkCategorie: {
      type: 'integer',
    },
    code: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    value: {
      type: 'number',
    },
    shortDescription: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
  required: [
    'fkCategorie',
    'code',
    'name',
    'value',
  ],
  additionalProperties: false,
})
