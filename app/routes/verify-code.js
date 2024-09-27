const Joi = require('joi')
const { routes, views, errorCodes } = require('../constants/forms')
const { routes: searchRoutes } = require('../constants/search')
const { enforcement } = require('../auth/permissions')
const ViewModel = require('../models/verify-code')
const { validatePayload } = require('../schema/verify-code')
const { getUser } = require('../auth')
const { isCodeCorrect, sendVerifyEmail } = require('../api/ddi-index-api/user')

const invalidCodeErrorMessage = 'The code you entered is not correct, or may have expired, try entering it again or request a new code '

const constructModel = (request) => {
  return {
    user: getUser(request),
    code: request.payload?.code
  }
}

module.exports = [
  {
    method: 'GET',
    path: routes.verifyCode.get,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        if (request.query?.resend === 'true') {
          await sendVerifyEmail(getUser(request))
          return h.redirect(routes.verifyCode.get)
        }

        return h.view(views.verifyCode, new ViewModel(constructModel(request)))
      }
    }
  },
  {
    method: 'POST',
    path: routes.verifyCode.post,
    options: {
      auth: { scope: enforcement },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          return h.view(views.verifyCode, new ViewModel(constructModel(request), error)).code(errorCodes.validationError).takeover()
        }
      },
      handler: async (request, h) => {
        const res = await isCodeCorrect(getUser(request), request.payload?.code)
        if (res !== 'Ok') {
          const error = new Joi.ValidationError(invalidCodeErrorMessage, [{ message: invalidCodeErrorMessage, path: ['code'], type: 'custom' }])
          return h.view(views.verifyCode, new ViewModel(constructModel(request), error)).code(errorCodes.validationError).takeover()
        }

        return h.redirect(searchRoutes.searchBasic.get)
      }
    }
  }
]
