const notesService = require('../../controllers/noteService')
module.exports = (app) => {
  app.get('/api/v1/report/:clientUrn', async (req, res) => {
    const { data: notes } = await notesService.getNotes(req.params.clientUrn)
    const { data: cases } = await notesService.getCases(req.params.clientUrn)
    const { data: workQ } = await notesService.getWorkQ(req.params.clientUrn)
    res.json({ notes, cases, workQ })
  })
}
 