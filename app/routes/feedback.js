const { routes, views, errorCodes } = require('../constants/forms')
const { enforcement } = require('../auth/permissions')
const ViewModel = require('../models/feedback')
const { validatePayload } = require('../schema/feedback')
const { getUser } = require('../auth')
const { submitFeedback } = require('../api/ddi-index-api/user')

module.exports = [
  {
    method: 'GET',
    path: routes.feedback.get,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        return h.view(views.feedback, new ViewModel(request.payload, request.query.logout))
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
          return h.view(views.feedback, new ViewModel(request.payload, request.query.logout, error)).code(errorCodes.validationError).takeover()
        }
      },
      handler: async (request, h) => {
        const data = {
          fields: [
            { name: 'CompletedTask', value: request.payload?.completedTask },
            { name: 'Details', value: request.payload?.details ?? '' },
            { name: 'Satisfaction', value: request.payload?.satisfaction }
          ]
        }
        await submitFeedback(data, getUser(request))

        return h.redirect(request?.query?.logout ? '/logout?feedback=true' : routes.feedbackSent.get)
      }
    }
  }
]
