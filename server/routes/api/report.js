const ServicesReport = require('../../controllers/report.class')
const notesService = require('../../controllers/annotationService')
const models = require('../../models')
const { Op } = models.Sequelize
module.exports = (app) => {
  app.get('/api/v1/login', async (req, res) => {
    try {
      const token = await notesService.login()
      // eslint-disable-next-line no-console
      console.log({ token })
      res.status(201)
    } catch (err) {
      res.status(503).send(err)
    }
  })

  app.post('/api/v1/report/:clientUrn', async(req, res) => {
    const { to, from } = req.query
    const { clientUrn } = req.params
    await models.report.createNew({ to, from, clientUrn, workQ: [] })
    res.sendStatus(200)
  })

  app.get('/api/v1/report/:reportId', async (req, res) => {
    const { reportId } = req.params
    let { edit } = req.query
    edit = (edit === 'true') || false
    const report = await models.report.findOne({ where: { reportId } })
    const { to, from, clientUrn, workQ, approvals } = report.dataValues

    const servicesReport = new ServicesReport(to, from, clientUrn, workQ, approvals, edit)
    await servicesReport.generate()
    res.json(servicesReport.display())
  })

  app.put('/api/v1/report/:reportId', async (req, res) => {
    const { body } = req
    const report = await models.report.findOne({
      where: {
        reportId: req.params.reportId
      }
    })
    await report.update(body)
    res.sendStatus(200)
  })

  app.get('/api/v1/reports', async (req, res) => {
    const reports = await models.report.findAll()
    res.json(reports)
  })
}
