const models = require('./../../models')

module.exports = async (job, done) => {
  try {
    const locations = await models.g5_updatable_location.findAll({
      attributes: [
        'urn',
        [models.sequelize.fn('COUNT', models.sequelize.col('urn')), 'count']
      ],
      group: ['g5_updatable_location.urn'],
      having: models.sequelize.where(models.sequelize.fn('COUNT', models.sequelize.col('urn')), '>', 1)
    })

    for (const location of locations) {
      const client = location
      const { urn, count } = client.dataValues
      const dupes = await models.g5_updatable_location.findAll({
        where: { urn },
        limit: count - 1,
        order: [['createdAt', 'DESC']]
      })

      for (const dupe of dupes) {
        await dupe.destroy()
      }
    }

    done(null)
  } catch (err) {
    done(err)
  }
}
