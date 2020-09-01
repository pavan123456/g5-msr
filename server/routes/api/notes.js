const models = require('../../models')

module.exports = (app) => {
  app.put('/api/v1/update', async (req, res) => {
    const { body } = req
    console.log(JSON.stringify(body))
    res.json({ stuff: 'all good' })
  })

  app.put('/api/v1/note', async (req, res) => {
    // updates for a single note's text
  })
}
