const { routes, views, errorCodes } = require('../constants/forms')
const { enforcement } = require('../auth/permissions')
const ViewModel = require('../models/feedback')
const { validatePayload } = require('../schema/feedback')
// const { getUser } = require('../auth')

module.exports = [
  {
    method: 'GET',
    path: routes.feedback.get,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        return h.view(views.feedback, new ViewModel(request.payload))
      }
    }
  },
  {
    method: 'GET',
    path: routes.feedbackSent.get,
    options: {
      auth: { scope: enforcement },
      handler: async (_request, h) => {
        return h.view(views.feedbackSent)
      }
    }
  },
  {
    method: 'POST',
    path: routes.feedback.post,
    options: {
      auth: { scope: enforcement },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          return h.view(views.feedback, new ViewModel(request.payload, error)).code(errorCodes.validationError).takeover()
        }
      },
      handler: async (request, h) => {
        // await sendFeedback(getUser(request), request.payload)

        return h.redirect(routes.feedbackSent.get)
      }
    }
  }
]
