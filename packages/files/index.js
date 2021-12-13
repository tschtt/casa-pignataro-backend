import multer from 'multer'
import sharp from 'sharp'
import fs from 'fs'

import useMiddleware from './src/middleware.js'
import useFiles from './src/files.js'
import useImages from './src/images.js'

export const middleware = useMiddleware({ multer })
export const files = useFiles({ fs, sharp })
export const images = useImages({ fs, sharp })

export default files
