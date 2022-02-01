import makeSchema from '@packages/schema'

export default () => makeSchema({
  type: 'object',
  properties: {
    fkArticle: {
      type: 'number',
    },
    fkCategory: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    value: {
      type: 'string',
    },
  },
  required: [
    'name',
    'value',
  ],
  additionalProperties: false,
})
