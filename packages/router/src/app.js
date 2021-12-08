
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
      return (value.name === 'router')
        ? app.use(route, value)
        : addMethods(route, value)
    })

  app.all('*', (req, res) => {
    res.status(404).send({ success: false, message: `La ruta ${req.method} ${req.path} no existe` })
  })

  if (errorHandler) {
    app.use(errorHandler)
  }

  return app

  function cors(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.APP_URL_FRONTEND)
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
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
