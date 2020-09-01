const models = require('../../models')
const notesService = require('../../controllers/annotationService')
const objectUtil = require('../../controllers/util')
module.exports = (app) => {
  app.put('/api/v1/update', async (req, res) => {
    const { body } = req
    for (let i = 0; i < body.rows.length; i++) {
      const { id } = body.rows[i]
      const { keep, discard: update } = objectUtil.split(body.rows[i], ['id'])
      // await notesService.updateNote(id, update)
    }
    res.json({ stuff: 'all good' })
  })

  app.put('/api/v1/note', async (req, res) => {
    // updates for a single note's text
  })
}
