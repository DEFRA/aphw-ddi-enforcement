const { routes, views } = require('../../../constants/cdo/dog')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/dog-details')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')
const getUser = require('../../../auth/get-user')
const { checkUserAccess } = require('../../../lib/route-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewDogDetails.get}/{indexNumber?}`,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const indexNumber = request.params.indexNumber
        const user = getUser(request)

        const redirectRoute = await checkUserAccess(request, user)
        if (redirectRoute) {
          return h.redirect(redirectRoute)
        }

        const cdo = await getCdo(indexNumber, user)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request, true)

        return h.view(views.viewDogDetails, new ViewModel(cdo, backNav))
      }
    }
  }
]
