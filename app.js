const fetch = require('node-fetch')

exports.handler = async (event) => {
  const eventName = event.Records[0].eventName
  const dynamodbRecord = event.Records[0].dynamodb
  console.log('event', event.Records[0])
  if (eventName === 'REMOVE') {
    const email = dynamodbRecord.OldImage.email.S
    const taskName = dynamodbRecord.OldImage.task_name.S

    console.log('Currently running the task', taskName, 'for user', email)

    fetch('https://api.ourfin.tech/integrations/tbank/transaction_history', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('transaction_history', json)
      })

    fetch('https://api.ourfin.tech/integrations/tbank/credit_transfer', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('credit_transfer', json)
      })
  } else {
    console.log('Event is ' + eventName + ', Skipping execution')
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('{"status": 200, "message": "success"')
  }
  return response
}
