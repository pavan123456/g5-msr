const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10, 'abcdefghijklmnopqrstuvwxyz1234567890')

module.exports = (models, Sequelize, sequelize) => {
  models.report.createNew = (params) => {
    return sequelize.transaction(async (t) => {
      const { to, from, workQ, clientUrn } = params
      const report = await models.report.create({
        to,
        from,
        workQ,
        clientUrn
      }, { transaction: t })
      const reportId = hashids.encode(report.dataValues.id)
      return report.update({ reportId }, { transaction: t })
    })
  }
}
