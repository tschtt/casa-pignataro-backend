import { makeFormat } from '@packages/format'

export default ({ $hash }) => makeFormat({

  async clean(
    {
      id = 0,
      active = true,
      username = '',
      password = '',
      email = '',
      passwordReset = false,
    } = {},
    {
      hidePassword = true,
      hashPassword = false,
      defaultPassword = false,
    } = {},
  ) {

    active = !!active
    passwordReset = !!passwordReset

    if (hashPassword) {
      hidePassword = false
      password = await $hash.make(password)
    }

    if (defaultPassword) {
      hidePassword = false
      password = process.env.DEFAULT_PASSWORD
    }

    const item = {
      id,
      active,
      username,
      password,
      email,
      passwordReset,
    }

    if (hidePassword) {
      delete item.password
    }

    return item
  },

})
