const { routes, views, errorCodes } = require('../constants/forms')
const { routes: searchRoutes } = require('../constants/search')
const { enforcement } = require('../auth/permissions')
const ViewModel = require('../models/licence')
const { validatePayload } = require('../schema/licence')
const { getUser } = require('../auth')
const { setLicenceAccepted, isEmailVerified, sendVerifyEmail } = require('../api/ddi-index-api/user')

module.exports = [
  {
    method: 'GET',
    path: routes.secureAccessLicence.get,
    options: {
      auth: { scope: enforcement },
      handler: async (_request, h) => {
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
        failAction: async (_request, h, error) => {
          return h.view(views.secureAccessLicence, new ViewModel(error)).code(errorCodes.validationError).takeover()
        }
      },
      handler: async (request, h) => {
        const user = getUser(request)
        const accepted = await setLicenceAccepted(user)
        if (accepted) {
          const verified = await isEmailVerified(user)
          if (!verified) {
            await sendVerifyEmail(user)
            return h.redirect(routes.verifyCode.get)
          }
          return h.redirect(searchRoutes.searchBasic.get)
        } else {
          return h.redirect(routes.secureAccessLicence.get)
        }
      }
    }
  }
]
