const { routes, views } = require('../../../constants/cdo/index')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { getManageCdoDetails } = require('../../../api/ddi-index-api/cdo')
const ViewModel = require('../../../models/cdo/manage/cdo')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { getUser } = require('../../../auth')
const { responseStatus } = require('../../../constants/server')

module.exports = [
  {
    method: 'GET',
    path: `${routes.manageCdo.get}/{dogIndex?}`,
    options: {
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)

        const dogIndex = request.params.dogIndex
        const user = getUser(request)
        const details = await getManageCdoDetails(dogIndex, user)

        if (details == null) {
          return h.response().code(responseStatus.notFound404).takeover()
        }

        const cdo = await getCdo(dogIndex, user)

        return h.view(views.manageCdo, new ViewModel(details, cdo, backNav))
      }
    }
  }
]
