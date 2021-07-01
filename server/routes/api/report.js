const ServicesReport = require('../../controllers/report.class')
const notesService = require('../../controllers/annotationService')
const models = require('../../models')

module.exports = (app) => {
  app.get('/api/v1/login', async (req, res) => {
    try {
      await notesService.login()
      res.status(201)
    } catch (err) {
      res.status(503).send(err)
    }
  })

  app.get('/api/v1/reports', async (req, res) => {
    try {
      const { to, from, clientUrn } = req.query
      // workQ, approvals, and edit can go away once the ServicesReport class is
      // refactored to not use them and the report model is updated
      const workQ = []
      const approvals = []
      const edit = true
      const servicesReport = new ServicesReport(to, from, clientUrn, workQ, approvals, edit)
      await servicesReport.generate()
      res.json(servicesReport.display())
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  app.post('/api/v1/reports/client/:clientUrn', async (req, res) => {
    try {
      const { to, from } = req.query
      const { clientUrn } = req.params
      const { reportId } = await models.report.createNew({ to, from, clientUrn, workQ: [] })
      res.status(200).send({ reportId })
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  app.get('/api/v1/reports/client/:clientUrn', async (req, res) => {
    try {
      const { clientUrn } = req.params
      const reports = await models.report.findAll({
        where: { clientUrn },
        order: [
          ['from', 'DESC'],
          ['to', 'DESC']
        ],
        attributes: ['reportId', 'to', 'from', 'clientUrn']
      })
      const formattedReport = reports.map(report => ({ ...report.dataValues }))
      res.status(200).json(formattedReport)
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  app.put('/api/v1/reports/:reportId', async (req, res) => {
    const { body } = req
    const report = await models.report.findOne({
      where: {
        reportId: req.params.reportId
      }
    })
    await report.update(body)
    res.sendStatus(200)
  })

  app.get('/api/v1/reports/:reportId', async (req, res) => {
    const { reportId } = req.params
    let { edit } = req.query
    edit = (edit === 'true') || false
    const report = await models.report.findOne({ where: { reportId } })
    const { to, from, clientUrn, workQ, approvals } = report.dataValues
    const servicesReport = new ServicesReport(to, from, clientUrn, workQ, approvals, edit)
    await servicesReport.generate()
    res.json(servicesReport.display())
  })
}
