const express = require('express')
const dotenv = require('dotenv').config()
const { getAll, submit, top5 } = require('./models/scoreModel.js')
const app = express()
const PORT = 3000

app.use(express.json())

app.get('/scores', (req, res) => {
  top5((err, data) => {
    if(err) {
      res.status(400).send('unable to get')
    } else {
      res.status(200).json(data)
    }
  })
})

app.post('/scores', (req, res) => {
  submit(req.body, (err, data) => {
    if(err) {
      res.status(400).end('unable to save')
      return
    } else {
      res.status(200).json(data)
    }
  })
})




app.listen(PORT)
