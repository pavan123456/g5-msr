const ServiecesReport = require('../../controllers/report.class')
module.exports = (app) => {
  app.get('/api/v1/login', async (req, res) => {
    try {
      const token = await notesService.login()
      console.log({ token })
      res.status(201)
    } catch (err) {
      res.status(503).send(err)
    }
  })

  app.get('/api/v1/report/:clientUrn', async (req, res) => {
    const { to, from } = req.query
    const { clientUrn } = req.params
    const servicesReport = new ServiecesReport(to, from, clientUrn)
    await servicesReport.generate()
    const report = servicesReport.display()
    res.json(report)
  })
}
