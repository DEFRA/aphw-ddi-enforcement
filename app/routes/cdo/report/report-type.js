const { errorCodes } = require('../../../constants/forms')
const { routes, views } = require('../../../constants/cdo/report')
const { enforcement } = require('../../../auth/permissions')
const { ViewModel } = require('../../../models/cdo/report/report-type')
const { getCdoOrPerson, determineScreenAfterReportType } = require('../../../lib/report-helper')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const getUser = require('../../../auth/get-user')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { getReportTypeDetails, setReportTypeDetails, clearReportSession } = require('../../../session/report')
const { validatePayload } = require('../../../schema/portal/report/report-type')

module.exports = [
  {
    method: 'GET',
    path: `${routes.reportType.get}/{pk}/{sourceType}/{clearSession?}`,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const { pk, sourceType, clearSession } = request.params
        if (clearSession === 'clear') {
          clearReportSession(request)
          return h.redirect(`${routes.reportType.get}/${pk}/${sourceType}?src=${request.query.src}`)
        }

        const user = getUser(request)
        const redirectRoute = await getRedirectForUserAccess(request, user)
        if (redirectRoute) {
          return h.redirect(redirectRoute)
        }

        const cdoOrPerson = await getCdoOrPerson(sourceType, pk, user)
        if (!cdoOrPerson) {
          return h.response().code(errorCodes.notFoundError).takeover()
        }

        const data = getReportTypeDetails(request) || {
          sourceType,
          firstName: cdoOrPerson?.firstName,
          lastName: cdoOrPerson?.lastName,
          pk
        }
        setReportTypeDetails(request, data)

        const backNav = addBackNavigation(request, true)

        return h.view(views.reportType, new ViewModel(data, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.reportType.post}/{pk}/{sourceType}`,
    options: {
      auth: { scope: enforcement },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          console.log('POST report-type validation error', error)
          const reportDetails = { ...getReportTypeDetails(request), ...request.payload }
          const backNav = addBackNavigationForErrorCondition(request)
          return h.view(views.reportType, new ViewModel(reportDetails, backNav, error)).code(errorCodes.validationError).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = { ...getReportTypeDetails(request), ...request.payload }
        payload.reportType = request.payload?.reportType

        const backNav = addBackNavigation(request)

        const selected = payload.reportType

        const user = getUser(request)
        const { nextScreen, override } = await determineScreenAfterReportType(selected, payload, backNav, user)

        if (override) {
          payload.dogChosen = { indexNumber: override.indexNumber }
        }
        setReportTypeDetails(request, payload)

        return h.redirect(nextScreen)
      }
    }
  }
]
