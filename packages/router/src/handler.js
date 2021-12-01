
export const handler = (endpoint) => async (req, res, next) => {
  try {
    const result = await endpoint({ request: req, response: res, next })
    if (result) {
      res.send(result)
    }
  } catch (error) {
    next(error)
  }
}
