import app from './routes/index.js'

const PORT = process.env.APP_PORT

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
