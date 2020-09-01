const models = require('../../models')

module.exports = (app) => {
  app.put('/api/v1/notes', async (req, res) => {
    console.log({ req })
    res.status(201)
  })
}
