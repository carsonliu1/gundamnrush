const express = require('express')
const dotenv = require('dotenv').config()
const { getAll, submit, top5 } = require('./models/scoreModel.js')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 80

app.use(express.json())
app.use(cors())
app.use(express.static('../'))

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
