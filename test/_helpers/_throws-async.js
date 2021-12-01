import { expect } from 'chai'

export async function throwsAsync(errorName, method) {
  let error = null
  try {
    await method()
  }
  catch (err) {
    error = err
  }
  if (!error) {
    throw new Error('No tiro error')
  }
  expect(error.name).to.equals(errorName)
}
