
/**
 * @param {Object} config
 * @param {import("express")} config.express
 */
export default ({ express, handler }) => (routes = {}, { errorHandler } = {}) => {
  const app = express()

  app.use(express.json())
  app.use(cors)

  Object
    .entries(routes)
    .forEach(([route, value]) => {
      return (value.name === undefined)
        ? addMethods(route, value)
        : app.use(route, value)
    })

  app.all('*', (req, res) => {
    res.status(404).send({ success: false, message: `La ruta ${req.method} ${req.path} no existe` })
  })

  if (errorHandler) {
    app.use(errorHandler)
  }

  return app

  function cors(req, res, next) {
    const origins = process.env.APP_ALLOW_ORIGINS.split(',')

    if (origins.indexOf(req.headers.origin) !== -1) {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
      res.header('Allow', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    }

    next()
  }

  function addMethods(route, value) {
    Object
      .entries(value)
      .forEach(([method, callback]) => {
        if (Array.isArray(callback)) {
          app[method](route, ...callback.map((cb) => handler(cb)))
        }
        else {
          app[method](route, handler(callback))
        }
      })
  }
}
