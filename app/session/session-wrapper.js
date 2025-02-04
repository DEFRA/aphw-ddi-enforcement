const { keys } = require('../constants/forms')

const getFromSession = (request, keyName) => {
  return request.yar.get(keyName)
}

const setInSession = (request, keyName, keyValue) => {
  request.yar.set(keyName, keyValue)
}

const clearSessionDown = (request, h, leaveMinimalSession = false) => {
  setInSession(request, keys.acceptedLicence, null)
  setInSession(request, keys.loggedInForNavRoutes, null)
  request.cookieAuth.clear()
  if (!leaveMinimalSession) {
    setInSession(request, 'returnUrl', null)
    request.yar.reset()
    h.unstate('dangerous_dog_act_enforcement_session')
  }
  h.unstate('nonce')
  h.unstate('state')
  h.unstate('session_auth')
}

module.exports = {
  getFromSession,
  setInSession,
  clearSessionDown
}
