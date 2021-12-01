/**
 * @param {Object} config
 * @param {import("express")} config.express
 */
export default ({ express, handler }) => (routes = {}) => {
  const router = express.Router()

  Object
    .entries(routes)
    .forEach(([route, value]) => {
      return (value.name === 'router')
        ? router.use(route, value)
        : addMethods(route, value)
    })

  return router

  function addMethods(route, value) {
    Object
      .entries(value)
      .forEach(([method, callback]) => {
        if (Array.isArray(callback)) {
          router[method](route, ...callback.map((callback) => handler(callback)))
        }
        else {
          router[method](route, handler(callback))
        }
      })
  }
}
