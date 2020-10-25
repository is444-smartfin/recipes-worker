const fetch = require('node-fetch')

exports.handler = async (event, context) => {
  const eventRecord = event.Records[0]
  const eventName = eventRecord.eventName
  const dynamodbRecord = eventRecord.dynamodb
  console.log('event', eventRecord)

  // If userIdentity prop exists in event.Records[0], means it's a System Delete (based off TTL attribute)
  // eventually, we change it to 'userIdentity' in eventRecord && eventName === 'REMOVE'
  if (eventName === 'REMOVE') {
    // We immediately process it
    const email = dynamodbRecord.OldImage.email.S
    const taskName = dynamodbRecord.OldImage.task_name.S
    const eventId = eventRecord.eventID
    console.log('Currently running the task', taskName, 'for user', email)

    const apiKey = 'randomKey'
    const payload = dynamodbRecord.OldImage
    const data = JSON.stringify({
      apiKey,
      eventId,
      payload
    })
    console.log(data)
    const resp = await post('https://giant-shrimp-43.loca.lt/integrations/tbank/recipe_salary_transfer', {
      'Content-Type': 'application/json'
    }, data)

    console.log(resp)
    console.log('Done running the task', taskName, 'for user', email)
  } else {
    console.log('Event is', eventName, 'and not a system delete, not running the task.')
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('{"status": 200, "message": "Lambda task has been triggered."')
  }
  return response
}

const get = async (requestUrl) => {
  return new Promise((resolve, reject) => {
    try {
      fetch(requestUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
        .then((response) => response.json())
        .then((json) => resolve(json))
    } catch (error) {
      reject(error)
    }
  })
}

const post = async (requestUrl, headers = {}, body = '') => {
  return new Promise((resolve, reject) => {
    console.log(headers)
    try {
      fetch(requestUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...headers
        },
        body
      })
        .then((response) => response.json())
        .then((json) => resolve(json))
    } catch (error) {
      console.log('post > error occured')
      reject(error)
    }
  })
}
