const notesService = require('../../controllers/noteService')

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
    const notes = await notesService.getNotes(req.params.clientUrn)
    res.json(notes.data)
  })
}
