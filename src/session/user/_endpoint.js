
export default ({ hash, admins }) => ({

  async find(request) {
    const id = request.auth.payload.id

    const admin = await admins.findOne({ id })

    delete admin.password

    return admin
  },

  async update(request) {
    const id = request.auth.payload.id
    const update = request.body

    if (update.password) {
      update.password = await hash.make(update.password)
    }

    await admins.updateOne({ id }, update)

    const admin = await admins.findOne({ id })

    delete admin.password

    return admin
  },

})
