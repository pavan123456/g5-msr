const models = require('../../models')

module.exports = (app) => {
  app.put('/api/v1/update', async (req, res) => {
    const { body } = req
    console.log({ body })
    res.json({ stuff: 'all good' })
  })
}
