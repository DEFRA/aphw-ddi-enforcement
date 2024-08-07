const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/dog-details')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewDogDetails.get}/{indexNumber?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const indexNumber = request.params.indexNumber
        const cdo = await getCdo(indexNumber)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request, true)

        return h.view(views.viewDogDetails, new ViewModel(cdo, backNav))
      }
    }
  }
]
