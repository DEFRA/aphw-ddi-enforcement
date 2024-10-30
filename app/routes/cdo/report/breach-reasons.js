const { errorCodes } = require('../../../constants/forms')
const { routes, views } = require('../../../constants/cdo/report')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/report/breach-reasons')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const getUser = require('../../../auth/get-user')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { getReportTypeDetails } = require('../../../session/report')
const { getBreachCategories } = require('../../../api/ddi-index-api/dog-breaches')
const { validatePayload } = require('../../../schema/portal/report/breach-reasons')
const { isSessionValid } = require('../../../lib/report-helper')
const { submitReportSomething } = require('../../../api/ddi-index-api/user')

module.exports = [
  {
    method: 'GET',
    path: routes.breachReasons.get,
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
          return h.response().code(errorCodes.notFoundError).takeover()
        }

        const backNav = addBackNavigation(request, false)
        const breachCategories = await getBreachCategories(user)

        return h.view(views.breachReasons, new ViewModel(details, breachCategories, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: routes.breachReasons.post,
    options: {
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          console.log('POST breach-reason validation error', error)
          const user = getUser(request)
          const payload = { ...getReportTypeDetails(request), ...request.payload }
          const breachCategories = await getBreachCategories(user)
          const backNav = addBackNavigationForErrorCondition(request)
          const viewModel = new ViewModel(payload, breachCategories, backNav, error)

          return h.view(views.breachReasons, viewModel).code(errorCodes.validationError).takeover()
        }
      },
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const payload = { ...getReportTypeDetails(request), ...request.payload }

        await submitReportSomething(payload, getUser(request))

        return h.redirect(routes.reportConfirmation.get)
      }
    }
  }
]
