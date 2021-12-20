import { makeFormat } from '@packages/format'

export default ({ $hash }) => makeFormat({

  async clean({ id = 0, active = true, username, password, email, passwordReset = false } = {}) {

    if (password) {
      password = await $hash.make(password)
    }

    return {
      id,
      active,
      username,
      password,
      email,
      passwordReset,
    }
  },

})
