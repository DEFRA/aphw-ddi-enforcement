const { routes, views } = require('../constants/forms')
const { routes: searchRoutes } = require('../constants/search')
const { enforcement } = require('../auth/permissions')
const ViewModel = require('../models/licence')
const { validatePayload } = require('../schema/licence')
const { getUser } = require('../auth')
const { setLicenceAccepted } = require('../api/ddi-index-api/user')

module.exports = [
  {
    method: 'GET',
    path: routes.secureAccessLicence.get,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        return h.view(views.secureAccessLicence, new ViewModel())
      }
    }
  },
  {
    method: 'POST',
    path: routes.secureAccessLicence.post,
    options: {
      auth: { scope: enforcement },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          return h.view(views.secureAccessLicence, new ViewModel(request.payload, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        if (await setLicenceAccepted(getUser(request))) {
          return h.redirect(searchRoutes.searchBasic.get)
        } else {
          return h.redirect(routes.secureAccessLicence.get)
        }
      }
    }
  }
]
