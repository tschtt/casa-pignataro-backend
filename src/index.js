import { useApp } from '@packages/router'

import admins from './admins/index.js'
import categories from './categories/index.js'
import contact from './contact/index.js'
import session from './session/index.js'

export default useApp({
  '/admins': admins,
  '/categories': categories,
  '/contact': contact,
  '/session': session,
  '/': {
    get: () => ({
      success: true,
      message: 'Bienvenido a la API de Casa Pignataro!',
    }),
  },
}, {
  errorHandler: (error, req, res, next) => {
    switch (error.name) {
      case 'BadRequestError':
        res.status(400).send({ success: false, message: error.message })
        break
      case 'AuthorizationError':
      case 'AuthenticationError':
        res.status(401).send({ success: false, message: error.message })
        break
      default:
        // eslint-disable-next-line no-console
        console.error(error.stack)
        res.status(500).send({ success: false, message: 'Error interno' })
        break
    }
  },
})
