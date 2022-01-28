import express from 'express'
import { useApp } from '@packages/router'

import admins from './admins/index.js'
import articles from './articles/index.js'
import contact from './contact/index.js'
import session from './session/index.js'
import sections from './sections/index.js'

export default useApp({
  '/admins': admins,
  '/articles': articles,
  '/contact': contact,
  '/session': session,
  '/sections': sections,
  '/files': express.static('files'),
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
        console.error(error.stack)
        res.status(500).send({ success: false, message: error.message || 'Error interno' })
        break
    }
  },
})
