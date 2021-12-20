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
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    passwordReset: {
      type: 'boolean',
    },
  },
  required: [
    'username',
    'email',
  ],
  additionalProperties: false,
})
