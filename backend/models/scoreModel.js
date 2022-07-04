const Score = require('../database/db.js')

module.exports = {
  getAll: (cb) => {
    Score.find({})
      .then(data => cb(null, data))
      .catch(err => cb(err))
  },
  submit: (body, cb) => {
    const { name, score } = body
    Score.create({name, score})
      .then(data => cb(null, data))
      .then(err => cb(err))
  },
  top5: (cb) => {
    Score.find({}).sort({score: -1}).limit(5)
      .then(data => cb(null, data))
      .catch(err => cb(err))
  }
}