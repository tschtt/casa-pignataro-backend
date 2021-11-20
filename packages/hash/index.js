import bcrypt from 'bcrypt'
import useHash from './src/_controller.js'

const rounds = process.env.HASH_ROUNDS

const hash = useHash({ bcrypt }, { rounds })

export default hash