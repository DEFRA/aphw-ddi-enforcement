const { routes, views, errorCodes } = require('../constants/forms')
const { routes: searchRoutes } = require('../constants/search')
const { enforcement } = require('../auth/permissions')
const ViewModel = require('../models/licence')
const { validatePayload } = require('../schema/licence')
const { getUser } = require('../auth')
const { setLicenceAccepted, isEmailVerified, sendVerifyEmail } = require('../api/ddi-index-api/user')
const { getFromSession } = require('../session/session-wrapper')
const constants = require('../constants/forms')

module.exports = [
  {
    method: 'GET',
    path: routes.secureAccessLicence.get,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const acceptedLicence = getFromSession(request, constants.keys.acceptedLicence) === 'Y'
        return h.view(views.secureAccessLicenceAgree, new ViewModel(undefined, { acceptedLicence }))
      }
    }
  },
  {
    method: 'GET',
    path: routes.secureAccessLicenceView.get,
    options: {
      auth: false,
      handler: async (_request, h) => {
        return h.view(views.secureAccessLicenceView)
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
          const acceptedLicence = getFromSession(request, constants.keys.acceptedLicence) === 'Y'

          return h.view(views.secureAccessLicenceAgree, new ViewModel(error, { acceptedLicence })).code(errorCodes.validationError).takeover()
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
