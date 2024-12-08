const entryKey = 'verificationPayload'

const get = (request, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

const getVerificationPayload = (request) => {
  return get(request)
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
