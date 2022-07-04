const mongoose = require('mongoose')

mongoose.connect(`mongodb://localhost:27017/highscores`);

const scoreSchema = mongoose.Schema({
  name: {
    type: String
  },
  score: {
    type: Number
  }
})

module.exports = mongoose.model('score', scoreSchema)