const path = require('path')
const removeDuplicates = path.resolve('./server/controllers/jobs/removeDuplicateUpdatable.js')

module.exports = {
  bullConfig,
  arenaConfig
}

function bullConfig (Bull) {
  const queue = new Bull('Remove Duplicates Updatable', process.env.REDIS_URL)
  queue.process('Remove Duplicates Updatable', 1, (job, done) => {
    return require(removeDuplicates)(job, done)
  })

  if (process.env.NODE_ENV === 'production') {
    queue.add('Remove Duplicates Updatable', null, { repeat: { cron: '0 0 * * *' } })
  }

  return queue
}

function arenaConfig () {
  return {
    name: 'Remove Duplicates Updatable',
    hostId: 'MSR',
    url: process.env.REDIS_URL
  }
}
