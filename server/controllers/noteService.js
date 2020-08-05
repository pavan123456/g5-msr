const axios = require('axios')

const {
  NOTE_SERVICE_USERNAME: username,
  NOTE_SERVICE_PASSWORD: password,
  NOTE_SERVICE_URL: noteServiceUrl,
  NOTE_SERVICE_TOKEN: token
} = process.env

module.exports = {
login,
getNotes,
getCases,
getWorkQ
}

function login () {
  return axios.post(`${noteServiceUrl}/api/v1/login`, { username, password })
}

function getNotes(clientUrn) {
console.log(`${noteServuceUrl}/api/v1/notes?access_token=${token}&clientUrn=${clientUrn}`)
  return axios.get(`${noteServuceUrl}/api/v1/notes?access_token=${token}&clientUrn=${clientUrn}`)
}
function getCases(clientUrn) {
  console.log(`${noteServuceUrl}/api/v1/cases?access_token=${token}&clientUrn=${clientUrn}`)
  return axios.get(`${noteServuceUrl}/api/v1/cases?access_token=${token}&clientUrn=${clientUrn}`)
}
function getWorkQ(clientUrn) {
  console.log(`${noteServuceUrl}/api/v1/dam/workq/${clientUrn}?access_token=${token}`)
  return axios.get(`${noteServuceUrl}/api/v1/dam/workq/${clientUrn}?access_token=${token}`)
}
