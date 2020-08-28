const { salesforce } = require('../../controllers/queue')

module.exports = (app, sfApi) => {
  // case coming from SFDC
  // vip monthly, everyone else quarterly
  // most recently completed quarter or month
  // check db to see if exists
  // need due date coming from case
  // may need to have reconciliation function run for edge
  // cases where report is run prior to quarter completion
  // case object: related to account => look up on account to get remaining data
  // service level: Level_of_Service__c
  // client urn: Client_URN__c
  app.post('/api/v1/xml/msr-report', async (req, res) => {
    const { body } = req
    await salesforce.add({ type: 'salesforce', body })
    res.set('Content-Type', 'text/xml')
    res.send(`
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <notificationsResponse 
            xmlns:ns2="urn:sobject.enterprise.soap.sforce.com" 
            xmlns="http://soap.sforce.com/2005/09/outbound"
          >
            <Ack>true</Ack>
          </notificationsResponse>
        </soap:Body>
      </soap:Envelope>
    `)
  })
}
