const { keys } = require('../../../constants/forms')
const { errorCodes } = require('../../../constants/forms')
const { routes, views } = require('../../../constants/search')
const { validateUser } = require('../../../api/ddi-index-api/user')
const { getUser } = require('../../../auth')
const ViewModel = require('../../../models/cdo/search/basic')
const searchSchema = require('../../../schema/portal/search/basic')
const { doSearch } = require('../../../api/ddi-index-api/search')
const { enforcement } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')
const { setInSession } = require('../../../session/session-wrapper')

module.exports = [{
  method: 'GET',
  path: routes.searchBasic.get,
  options: {
    auth: { scope: enforcement },
    handler: async (request, h) => {
      const user = getUser(request)

      await validateUser(user)

      const redirectRoute = await getRedirectForUserAccess(request, user)
      if (redirectRoute) {
        return h.redirect(redirectRoute)
      }

      setInSession(request, keys.loggedInForNavRoutes, 'Y')

      const searchCriteria = request.query

      const backNav = addBackNavigation(request)

      const url = request.url.href

      if (searchCriteria.searchTerms === undefined) {
        return h.view(views.searchBasic, new ViewModel(searchCriteria, [], url, backNav))
      }

      const errors = searchSchema.validate(searchCriteria, { abortEarly: false })
      if (errors.error) {
        return h.view(views.searchBasic, new ViewModel(searchCriteria, [], url, backNav, errors.error)).code(errorCodes.validationError).takeover()
      }

      const results = await doSearch(searchCriteria, getUser(request))

      return h.view(views.searchBasic, new ViewModel(searchCriteria, results, url, backNav))
    }
  }
}]
