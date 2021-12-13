
export default function useMiddleware({ multer }) {
  return multer({ dest: 'files' })
}
