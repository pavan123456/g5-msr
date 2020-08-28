require('dotenv').config()
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const queue = require('./controllers/queue')
const app = express()
queue.init(app)
const models = require('./models')
config.dev = process.env.NODE_ENV !== 'production'
require('./routes')(app)
const notesService = require('./controllers/annotationService')
async function start () {
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    // require('appmetrics-zipkin')()
    // require('appmetrics-prometheus').attach()
  }

  app.use(nuxt.render)
  models.sequelize
    .sync()
    .then(() => {
    })
  try {
    notesService.login()
  } catch (error) {
    throw new Error('Could not login to the Notes Service')
  }
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
