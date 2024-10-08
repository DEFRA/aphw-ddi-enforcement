const { views } = require('../constants/forms')

module.exports = {
  method: 'GET',
  path: '/post-logout',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    return h.view(request?.query?.feedback ? views.postLogoutWithFeedback : views.postLogout)
  }
}
