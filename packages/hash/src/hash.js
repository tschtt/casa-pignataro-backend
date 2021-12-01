
export default function useHash({ bcrypt }, { rounds = 10 } = {}) {
  return {

    async make(plain, options = {}) {
      return bcrypt.hash(plain, options.rounds || rounds)
    },

    async check(plain, hashed) {
      return bcrypt.compare(plain, hashed)
    },

  }
}
