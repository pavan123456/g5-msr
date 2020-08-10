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

function getNotes(clientUrn, to = '2020-08-07', from = '2020-06-01') {
  console.log(`${noteServiceUrl}/api/v1/notes?access_token=${token}&clientUrn=${clientUrn}&searchBy=createdAt&to=${to}&from=${from}`)
  return axios.get(`${noteServiceUrl}/api/v1/notes?access_token=${token}&clientUrn=${clientUrn}&searchBy=createdAt&to=${to}&from=${from}`)
}
function getCases(clientUrn) {
  console.log(`${noteServiceUrl}/api/v1/cases?access_token=${token}&clientUrn=${clientUrn}`)
  return axios.get(`${noteServiceUrl}/api/v1/cases?access_token=${token}&clientUrn=${clientUrn}`)
}
function getWorkQ(clientUrn) {
  console.log(`${noteServiceUrl}/api/v1/dam/workq/${clientUrn}?access_token=${token}`)
  return axios.get(`${noteServiceUrl}/api/v1/dam/workq/${clientUrn}?access_token=${token}`)
}
