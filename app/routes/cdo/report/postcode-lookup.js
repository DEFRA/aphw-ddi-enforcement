const { errorCodes } = require('../../../constants/forms')
const { routes, views } = require('../../../constants/cdo/report')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/report/postcode-lookup')
const { validatePayload } = require('../../../schema/portal/report/postcode-lookup')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { getReportTypeDetails, setReportTypeDetails } = require('../../../session/report')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { getUser } = require('../../../auth')
const { isSessionValid } = require('../../../lib/report-helper')

module.exports = [
  {
    method: 'GET',
    path: routes.postcodeLookup.get,
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

        const backNav = addBackNavigation(request)

        const data = {
          ...details,
          postcode: details?.postcode,
          houseNumber: details?.houseNumber
        }

        return h.view(views.postcodeLookup, new ViewModel(data, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: routes.postcodeLookup.post,
    options: {
      auth: { scope: enforcement },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          console.log('POST postcode-lookup validation error', error)
          const payload = request.payload

          const details = getReportTypeDetails(request)

          const backNav = addBackNavigationForErrorCondition(request)

          const data = {
            ...details,
            postcode: payload.postcode,
            houseNumber: payload.houseNumber
          }

          const viewModel = new ViewModel(data, backNav, error)

          return h.view(views.postcodeLookup, viewModel).code(errorCodes.validationError).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = { ...request.payload, ...getReportTypeDetails(request) }

        setReportTypeDetails(request, payload)

        const backNav = addBackNavigation(request)

        return h.redirect(`${routes.selectAddress.get}${backNav.srcHashParam}`)
      }
    }
  }
]
