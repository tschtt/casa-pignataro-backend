import './_config.js'
import app from './_app.js'

const PORT = process.env.APP_PORT

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`)
})