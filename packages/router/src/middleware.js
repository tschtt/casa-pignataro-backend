
export const handler = (endpoint) => async (req, res, next) => {
  try {
    const result = await endpoint(req, res, next)
    if (result) {
      res.send(result)
    }
  } catch (error) {
    next(error)
  }
}
