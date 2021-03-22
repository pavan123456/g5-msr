const models = require('../../models')
const notesService = require('../../controllers/annotationService')

module.exports = async (job, sfApi) => {
  if (!sfApi.isLoggedIn) {
    console.log('Signing In')
    await sfApi.signIn()
  }
  const ticketData = job.data.body['soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0]
  const report = {
    AccountId: ticketData['sf:accountid'][0],
    CaseNumber: ticketData['sf:casenumber'][0],
    ClosedDate: ticketData['sf:closeddate'][0],
    // need date we are going to use as due date
    CreatedDate: ticketData['sf:createddate'][0],
    RecordTypeId: ticketData['sf:recordtypeid'][0],
    Request_Type__c: ticketData['sf:request_type__c'][0]
  }
  const recordType = await sfApi.getRecordTypes([report.RecordTypeId], ['Id', 'Name'])[0]
  const client = await sfApi.getAccounts([report.AccountId], ['Id', 'Client_URN__c'])[0]
  report.clientUrn = client ? client.Client_URN__c : null
  report.recordType = recordType ? recordType.Name : null
  report.levelOfService = client ? client.Level_of_Service__c : null
  const { to, from } = getDateRange(report.levelOfService)

  const newReport = await models.report.findOrCreate({
    where: {
      clientUrn: report.clientUrn,
      from,
      to
    },
    defaults: {
      clientUrn: report.clientUrn,
      from,
      to,
      workQ: []
    }
  })
  // call SF and send structured URL with query param team
}
// need to update this with actual date
function getDateRange(levelOfService, date) {
  let from = '2020-04-01'
  const to = '2020-07-01'
  if (levelOfService === 'VIP Account Program') {
    from = '2020-07-01'
  }
  return { to, from }
}
