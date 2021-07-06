module.exports = {
  standardToUSDate
}

function standardToUSDate (str) {
  const pattern = /(\d{4})-(\d{1,2})-(\d{1,2})/
  const callback = (match, y, m, d) => `${m}-${d}-${y}`
  return str.replace(pattern, callback)
}
