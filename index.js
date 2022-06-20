import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(5000, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log('server OK')
})
