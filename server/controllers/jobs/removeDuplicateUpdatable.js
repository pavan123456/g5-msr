const models = require('./../../models')
const logger = require('./../winston')

module.exports = async (job, done) => {
  try {
    const locations = await models.sequelize.query(`
      SELECT "g5_updatable_location"."urn", COUNT("g5_updatable_location"."urn") AS "count" 
      FROM "g5_updatable_locations" AS "g5_updatable_location"
      INNER JOIN "g5_updatable_clients" on "g5_updatable_location"."client_urn" = "g5_updatable_clients"."urn"
      WHERE "g5_updatable_clients"."properties" ->> 'g5_internal' = 'false'
      GROUP BY "g5_updatable_location"."urn" 
      HAVING COUNT("g5_updatable_location"."urn") > 1;`, {
      type: models.sequelize.QueryTypes.SELECT
    })

    logger.info(`Locations found after query: ${locations.length}`)

    for (const location of locations) {
      const { urn, count } = location
      const dupes = await models.g5_updatable_location.findAll({
        where: { urn },
        limit: count - 1,
        order: [['updatedAt', 'DESC']]
      })

      logger.info(`Duplicates found: ${dupes.length} with location urn: ${urn}`)

      const promises = dupes.map(dupe => dupe.destroy())
      const result = await Promise.all(promises)

      logger.info(`Result after delete dupes: ${result}`)

      const dupesAfterDelete = await models.g5_updatable_location.findAll({
        where: { urn },
        limit: count - 1,
        order: [['updatedAt', 'DESC']]
      })

      logger.info(`Duplicates after delete: ${dupesAfterDelete.length}`)
    }

    done(null)
  } catch (err) {
    done(err)
  }
}
