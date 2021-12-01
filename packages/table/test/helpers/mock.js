
export function mock(fn = () => {}) {
  const mock = {
    calls: [],
    returns: undefined,
  }

  const result = (...args) => {
    mock.calls.push(args)
    const result = fn(...args)

    if (mock.returns === undefined) { return result }
    return mock.returns
  }

  result.mock = mock

  return result
}
