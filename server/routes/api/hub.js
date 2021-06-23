const models = require('../../models')

module.exports = (app) => {
  app.get('/api/v1/hub/clients', async (req, res) => {
    const clients = await models.g5_updatable_client.findAll({
      attributes: [
        'name',
        'urn',
        [models.sequelize.json('properties.branded_name'), 'branded_name']
      ]
    })
    res.json(clients)
  })
}
