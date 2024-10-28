const { routes, views } = require('../../../constants/cdo/report')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/report/something-else')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const getUser = require('../../../auth/get-user')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { getReportTypeDetails } = require('../../../session/report')
const { validatePayload } = require('../../../schema/portal/report/something-else')
const { isSessionValid } = require('../../../lib/report-helper')

module.exports = [
  {
    method: 'GET',
    path: routes.somethingElse.get,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const user = getUser(request)
        const redirectRoute = await getRedirectForUserAccess(request, user)
        if (redirectRoute) {
          return h.redirect(redirectRoute)
        }

        const details = getReportTypeDetails(request)
        if (!isSessionValid(details)) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request, false)

        return h.view(views.somethingElse, new ViewModel(details, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: routes.somethingElse.post,
    options: {
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          console.log('POST something-else validation error', error)
          const payload = { ...getReportTypeDetails(request), ...request.payload }
          const backNav = addBackNavigationForErrorCondition(request)
          const viewModel = new ViewModel(payload, backNav, error)

          return h.view(views.somethingElse, viewModel).code(400).takeover()
        }
      },
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const payload = { ...getReportTypeDetails(request), ...request.payload }

        console.log('JB final payload - something else', payload)

        return h.redirect(routes.reportConfirmation.get)
      }
    }
  }
]
