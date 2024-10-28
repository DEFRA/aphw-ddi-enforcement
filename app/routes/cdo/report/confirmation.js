const { routes, views } = require('../../../constants/cdo/report')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/report/confirmation')
const getUser = require('../../../auth/get-user')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { getReportTypeDetails } = require('../../../session/report')
const { isSessionValid } = require('../../../lib/report-helper')

module.exports = [
  {
    method: 'GET',
    path: routes.reportConfirmation.get,
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

        return h.view(views.reportConfirmation, new ViewModel(details))
      }
    }
  }
]
