const models = require('../../models')
const { Op } = require('sequelize')

module.exports = (app) => {
  app.get('/api/v1/hub/clients', async (req, res) => {
    const clients = await models.g5_updatable_client.findAll({
      where: {
        properties: {
          status: {
            [Op.not]: 'Deleted'
          },
          g5_internal: {
            [Op.not]: true
          }
        }
      },
      attributes: [
        'name',
        'urn'
      ]
    })
    res.json(clients)
  })
}
