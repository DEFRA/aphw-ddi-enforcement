const { routes, views } = require('../../../constants/cdo/report')
const { getReportTypeDetails, setReportTypeDetails } = require('../../../session/report')
const ViewModel = require('../../../models/cdo/report/select-dog')
const { enforcement } = require('../../../auth/permissions')
const Joi = require('joi')
const { getPersonAndDogs } = require('../../../api/ddi-index-api/person')
const getUser = require('../../../auth/get-user')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { determineScreenAfterSelectDog, isSessionValid } = require('../../../lib/report-helper')

module.exports = [{
  method: 'GET',
  path: routes.selectDog.get,
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

      const personAndDogs = await getPersonAndDogs(details.pk, user)

      const backNav = addBackNavigation(request)

      return h.view(views.selectDog, new ViewModel(details, personAndDogs?.dogs, backNav))
    }
  }
},
{
  method: 'POST',
  path: routes.selectDog.post,
  options: {
    auth: { scope: enforcement },
    validate: {
      payload: Joi.object({
        dog: Joi.number().required().messages({
          '*': 'Select an option'
        })
      }),
      failAction: async (request, h, error) => {
        const user = getUser(request)

        const details = getReportTypeDetails(request)

        const personAndDogs = await getPersonAndDogs(details.pk, user)

        const backNav = addBackNavigationForErrorCondition(request)

        return h.view(views.selectDog, new ViewModel(details, personAndDogs?.dogs, backNav, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const user = getUser(request)

      const dogChosen = request.payload.dog

      const backNav = addBackNavigation(request)

      const details = getReportTypeDetails(request)

      const personAndDogs = await getPersonAndDogs(details.pk, user)

      const newDetails = {
        ...details,
        dogChosen: {
          indexNumber: personAndDogs.dogs[dogChosen - 1]?.indexNumber,
          arrayInd: dogChosen
        }
      }
      setReportTypeDetails(request, newDetails)

      return h.redirect(determineScreenAfterSelectDog(details.reportType, backNav))
    }
  }
}]
