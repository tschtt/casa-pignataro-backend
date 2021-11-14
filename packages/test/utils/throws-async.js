import { expect } from "chai"

export async function throws_async(error_name, method) {
  let error = null
  try {
    await method()
  }
  catch (err) {
    error = err
  }
  if(!error) {
    throw new Error('No tiro error')
  }
  expect(error.name).to.equals(error_name)
}