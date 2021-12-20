import Ajv from 'ajv'
import config from './src/schema.js'

export const ajv = new Ajv()
export const makeSchema = config({ ajv })
export default makeSchema
