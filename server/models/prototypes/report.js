const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10, 'abcdefghijklmnopqrstuvwxyz1234567890')
const { standardToUSDate } = require('../../utilities/string')

module.exports = (models, Sequelize, sequelize) => {
  models.report.createNew = (params) => {
    return sequelize.transaction(async (t) => {
      const { to, from, workQ, clientUrn } = params
      const [report] = await models.report.findOrCreate(
        {
          where: {
            to,
            from,
            clientUrn
          },
          defaults: {
            to,
            from,
            workQ,
            clientUrn
          },
          transaction: t
        })
      const reportId = hashids.encode(report.dataValues.id)
      return report.update({ reportId }, { transaction: t })
    })
  }

  models.report.reportsByClientUrn = async (clientUrn) => {
    const reports = await models.report.findAll({
      where: { clientUrn },
      order: [
        ['from', 'DESC'],
        ['to', 'DESC']
      ],
      attributes: ['reportId', 'to', 'from', 'clientUrn']
    })
    const formattedReport = reports.map((report) => {
      const { reportId, to, from, clientUrn } = report
      return {
        reportId,
        clientUrn,
        to: standardToUSDate(to),
        from: standardToUSDate(from)
      }
    })
    return formattedReport
  }
}
