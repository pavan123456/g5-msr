const { REDIS_URL } = process.env
const sfApi = require('../salesforce')

module.exports = {
  bullConfig,
  arenaConfig
}

function bullConfig (Bull) {
  const salesforce = new Bull('salesforce', REDIS_URL)
  salesforce.process(1, (job) => {
    return require('../jobs/salesforce')(job, sfApi)
  })
  salesforce.on('completed', checkForSignout)
  salesforce.on('failed', checkForSignout)

  async function checkForSignout (job, res) {
    const waiting = await salesforce.getWaitingCount()
    const active = await salesforce.getActiveCount()
    if (waiting === 0 && active === 0) {
      await sfApi.signOut()
    }
  }

  return salesforce
}

function arenaConfig () {
  return {
    name: 'salesforce',
    hostId: 'notes',
    url: REDIS_URL
  }
}
