const { MessageSender } = require('ffc-messaging')
const { documentRequestQueue } = require('../../../config/messaging/document-request-queue')
const { createMessage } = require('./download-request')

const sendMessage = async (data, user) => {
  const documentRequestSender = new MessageSender(documentRequestQueue)

  const message = createMessage(data, user)

  await documentRequestSender.sendMessage(message)
  await documentRequestSender.closeConnection()

  return message.body.certificateId
}

module.exports = {
  sendMessage
}
