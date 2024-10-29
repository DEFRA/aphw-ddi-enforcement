const Joi = require('joi')
const { errorCodes } = require('../../../constants/forms')
const { routes, views } = require('../../../constants/cdo/report')
const { getPostcodeAddresses } = require('../../../api/os-places')
const { getReportTypeDetails, setReportTypeDetails } = require('../../../session/report')
const ViewModel = require('../../../models/cdo/report/select-address')
const { enforcement } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')
const getUser = require('../../../auth/get-user')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { isSessionValid, sendReportEmail } = require('../../../lib/report-helper')

module.exports = [
  {
    method: 'GET',
    path: routes.selectAddress.get,
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

        const postcode = details?.postcode
        const houseNumber = details?.houseNumber
        const addresses = await getPostcodeAddresses(postcode ? postcode.toUpperCase() : '', houseNumber)

        setInSession(request, 'addresses', addresses)

        if (addresses && addresses.length === 1) {
          setReportTypeDetails(request, { ...details, selectedAddress: addresses[0] })
        }

        const backNav = addBackNavigation(request)
        details.backLink = backNav.backLink
        details.srcHashParam = backNav.srcHashParam

        return h.view(views.selectAddress, new ViewModel(details, addresses))
      }
    }
  },
  {
    method: 'POST',
    path: routes.selectAddress.post,
    options: {
      auth: { scope: enforcement },
      validate: {
        payload: Joi.object({
          address: Joi.number().min(0).required().messages(
            { '*': 'Select an address.' }
          )
        }),
        failAction: async (request, h, error) => {
          const details = getReportTypeDetails(request)
          const addresses = getFromSession(request, 'addresses')

          return h.view(views.selectAddress, new ViewModel(details, addresses, error)).code(errorCodes.validationError).takeover()
        }
      },
      handler: async (request, h) => {
        const details = getReportTypeDetails(request)
        const addresses = getFromSession(request, 'addresses')
        const selectedAddress = addresses[request.payload.address]

        const payload = { ...details, ...selectedAddress, user: getUser(request) }

        await sendReportEmail(payload)

        return h.redirect(routes.reportConfirmation.get)
      }
    }
  }
]
