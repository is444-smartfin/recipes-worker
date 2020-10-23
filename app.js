const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-1' })

// Create client outside of handler to reuse
const dynamodbstreams = new AWS.DynamoDBStreams()

var params = {
  StreamArn: 'arn:aws:dynamodb:ap-southeast-1:709602025381:table/recipes/stream/2020-10-23T16:35:51.358'
}

dynamodbstreams.describeStream(params, function (err, data) {
  if (err) console.log(err, err.stack) // an error occurred
  else console.log(data) // successful response
})
