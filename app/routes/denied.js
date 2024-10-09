const { clearSessionDown } = require('../session/session-wrapper')

const UNAUTHORISED = 401

module.exports = {
  method: 'GET',
  path: '/denied',
  options: {
    auth: false
  },
  handler: (request, h) => {
    clearSessionDown(request, h)

    return h.view('denied').code(UNAUTHORISED)
  }
}
