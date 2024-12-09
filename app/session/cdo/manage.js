const entryKey = 'verificationPayload'

const getVerificationPayload = (request) => {
  return request.yar?.get(entryKey)
}
const setVerificationPayload = (request, verificationPayloadData) => {
  request.yar.set(entryKey, verificationPayloadData)
}

const clearVerificationPayload = request => {
  setVerificationPayload(request, {})
}

module.exports = {
  getVerificationPayload,
  setVerificationPayload,
  clearVerificationPayload
}
