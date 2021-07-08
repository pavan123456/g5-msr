require('dotenv').config()
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const g5Auth = require('@getg5/g5-auth')

const {
  G5_AUTH_ENDPOINT: authorizationURL,
  G5_TOKEN_ENDPOINT: tokenURL,
  G5_AUTH_CLIENT_ID: clientID,
  G5_AUTH_CLIENT_SECRET: clientSecret,
  G5_AUTH_REDIRECT_URI: callbackURL,
  G5_AUTH_ME_ENDPOINT: authMeEndpoint,
  SESSION_SECRET: secret
} = process.env

const authConfig = {
  passport: {
    authorizationURL,
    tokenURL,
    clientID,
    clientSecret,
    callbackURL
  },
  authMeEndpoint,
  session: {
    secret
  },
  sucessRedirectPath: '/'
}

const regexWhitelist = [
  /\/report$/,
  /\/api\/v1\/reports\/display\/\S*$/,
  /\/api\/v1\/reports\/\S*$/,
  /\/[0-9a-z-]*\.png/,
  /\/[0-9a-z-]*\.ico/,
  /\/[~./0-9a-z-]*\.js/
]

const config = require('../nuxt.config.js')
const app = express()
const queue = require('./controllers/queue')
queue.init(app)
g5Auth.init(app, authConfig)
const models = require('./models')
config.dev = process.env.NODE_ENV !== 'production'

function dynamicWhitelist (path) {
  return regexWhitelist.some(url => url.test(path))
}

function checkWhiteList (req, res, next) {
  if (dynamicWhitelist(req.path)) {
    console.log(`Whitelisted: ${req.path}`)
    next()
  } else {
    g5Auth.isAuthenticated(req, res, next)
  }
}

async function checkUserRoles (req, res, next) {
  if (req.user) {
    const { id } = req.user
    const user = await models.user.findOne({
      where: { id },
      include: [{ model: models.role }]
    })
    const userJson = user.toJSON()
    req.userRoles = userJson.roles.map((role) => {
      const { name, type, urn } = role
      return { name, type, urn }
    })
  }
  next()
}

app.use(checkWhiteList)
app.use(checkUserRoles)

require('./routes')(app)
const notesService = require('./controllers/annotationService')

async function start () {
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(nuxt.render)

  models.sequelize
    .sync()
    .then(() => {
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
    })
    .catch(err => console.log(err))
}

start()
