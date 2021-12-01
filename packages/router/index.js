import express from 'express'
import configApp from './src/app.js'
import configRouter from './src/router.js'
import { handler } from './src/middleware.js'

export const useApp = configApp({ express, handler })
export const useRouter = configRouter({ express, handler })
