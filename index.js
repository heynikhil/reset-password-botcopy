const express = require('express')
const bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment')
const email = require('./services/sendgrid')

// eslint-disable-next-line new-cap
const app = new express()
app.use(bodyParser.json())
app.use(express.static('public'))

app.post('/', (request, response) => {
  const agent = new WebhookClient({ request, response })
  console.log('Intent::', agent.intent)

  function sendEmail (agent) { // change
    email.send(email.resetPassword, { sEmail: [agent.parameters.sEmail], data: agent.parameters }, console.log)
    agent.add('Got it.Thank you! I will make sure our team reaches out to you soon.You are free to continue to hold.Feel free to ask me any questions while you wait.')
  }

  const intentMap = new Map()
  intentMap.set('resetPassword-email', sendEmail)

  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080, () => {
  console.log('...magic...magic...')
})

