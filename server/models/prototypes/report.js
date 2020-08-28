const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10, 'abcdefghijklmnopqrstuvwxyz1234567890')
module.exports = (models, Sequelize, sequelize) => {
  const { Op } = Sequelize
  models.report.createNew = async (params) => {
    return sequelize.transaction(async (t) => {
      console.log({ params })
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
