const notesService = require('../../controllers/noteService')
module.exports = (app) => {
  app.get('/api/v1/report/:clientUrn', async (req, res) => {
    const notes = await notesService.getNotes(req.params.clientUrn)
    res.json(notes.data)
  })
}