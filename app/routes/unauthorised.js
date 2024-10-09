const { clearSessionDown } = require('../session/session-wrapper')

const UNAUTHORISED = 401

module.exports = {
  method: 'GET',
  path: '/unauthorised',
  options: {
    auth: false
  },
  handler: (request, h) => {
    clearSessionDown(request, h, true)

    return h.view('unauthorized').code(UNAUTHORISED)
  }
}
