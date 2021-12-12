import multer from 'multer'

export const middleware = multer({ dest: 'files' })
