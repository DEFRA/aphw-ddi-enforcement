const { routes, views } = require('../../../constants/cdo/report')
const { errorCodes } = require('../../../constants/forms')
const ViewModel = require('../../../models/cdo/report/address')
const addressSchema = require('../../../schema/portal/report/address')
const { enforcement } = require('../../../auth/permissions')
const { getCountries } = require('../../../api/ddi-index-api')
const { getUser } = require('../../../auth')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { getReportTypeDetails } = require('../../../session/report')
const { isSessionValid, sendReportEmail } = require('../../../lib/report-helper')

module.exports = [{
  method: 'GET',
  path: routes.address.get,
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

      const countries = await getCountries(user)
      const backNav = addBackNavigation(request, false)

      return h.view(views.address, new ViewModel(details, backNav, countries))
    }
  }
},
{
  method: 'POST',
  path: routes.address.post,
  options: {
    auth: { scope: enforcement },
    validate: {
      options: {
        abortEarly: false
      },
      payload: addressSchema,
      failAction: async (request, h, error) => {
        console.log('POST address validation error', error)
        const user = getUser(request)
        const data = { ...request.payload, ...getReportTypeDetails(request) }
        const countries = await getCountries(user)
        const backNav = addBackNavigationForErrorCondition(request)

        return h.view(views.address, new ViewModel(data, backNav, countries, error)).code(errorCodes.validationError).takeover()
      }
    },
    handler: async (request, h) => {
      const payload = { ...request.payload, ...getReportTypeDetails(request), user: getUser(request) }

      await sendReportEmail(payload)

      return h.redirect(routes.reportConfirmation.get)
    }
  }
}]
