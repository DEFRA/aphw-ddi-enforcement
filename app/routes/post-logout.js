const { views } = require('../constants/forms')
const { clearSessionDown } = require('../session/session-wrapper')

module.exports = {
  method: 'GET',
  path: '/post-logout',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    clearSessionDown(request, h)
    return h.view(request?.query?.feedback ? views.postLogoutWithFeedback : views.postLogout)
  }
}
