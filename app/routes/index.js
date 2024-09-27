const constants = require('../constants/forms')
const { setInSession } = require('../session/session-wrapper')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: false,
    handler: async (request, h) => {
      setInSession(request, constants.keys.acceptedLicence, null)
      return h.view('index')
    }
  }
}
