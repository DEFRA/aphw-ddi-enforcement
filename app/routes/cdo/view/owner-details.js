const { routes, views } = require('../../../constants/cdo/owner')
const { routes: formRoutes } = require('../../../constants/forms')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/owner-details')
const { getPersonAndDogs } = require('../../../api/ddi-index-api/person')
const { addBackNavigation } = require('../../../lib/back-helpers')
const getUser = require('../../../auth/get-user')
const { licenceNotYetAccepted } = require('../../../lib/route-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewOwnerDetails.get}/{personReference?}`,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const user = getUser(request)

        if (await licenceNotYetAccepted(request, user)) {
          return h.redirect(formRoutes.secureAccessLicence.get)
        }

        const personAndDogs = await getPersonAndDogs(request.params.personReference, user)

        if (personAndDogs === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request, true)

        return h.view(views.viewOwnerDetails, new ViewModel(personAndDogs, backNav))
      }
    }
  }
]
