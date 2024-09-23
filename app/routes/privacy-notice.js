const { routes, views } = require('../constants/forms')

module.exports = [
  {
    method: 'GET',
    path: routes.privacyNotice.get,
    options: {
      auth: false,
      handler: async (_request, h) => {
        return h.view(views.privacyNotice)
      }
    }
  }
]
