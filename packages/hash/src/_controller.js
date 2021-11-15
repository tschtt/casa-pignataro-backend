
export default function useHash({ bcrypt }, { rounds = 10 } = {}) {
  return {

    async make(plain, options = {}) {
      return await bcrypt.hash(plain, options.rounds || rounds)
    },

    async check(plain, hashed) {
      return await bcrypt.compare(plain, hashed)
    }
    
  }
}