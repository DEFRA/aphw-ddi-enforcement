const { keys } = require('../constants/forms')
const { getFromSession, setInSession, clearSessionDown } = require('../session/session-wrapper')
const { validateUser } = require('../api/ddi-index-api/user')
const { logoutUser } = require('../auth/logout')
const { enforcement } = require('../auth/permissions')
const { getRedirectForUserAccess, isUrlEndingFromList } = require('../lib/route-helpers')
const { randomise } = require('../config/perf-test')

const urlPathsToExclude = [
  '/post-logout',
  '/post-logout?feedback=true',
  '/unauthorised',
  '/denied'
]

const determineRedirectUrl = returnUrl => {
  return returnUrl &&
    returnUrl !== '' &&
    !isUrlEndingFromList(returnUrl, urlPathsToExclude)
    ? returnUrl
    : '/cdo/search/basic'
}

module.exports = {
  method: 'GET',
  path: '/authenticate',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    console.log('~~~~~~ Chris Debug ~~~~~~ 31', '')
    try {
      const user = randomise()
      try {
        await validateUser(user)
      } catch (e) {
        console.log('~~~~~~ Chris Debug ~~~~~~ 37', '')
        console.error('Validation failed', e)

        const host = request.headers.host
        const protocol = host?.indexOf('localhost') > -1 ? 'http' : 'https'

        console.log('~~~~~~ Chris Debug ~~~~~~ 48', 'user.accessToken', user.accessToken)
        const result = await logoutUser(user.accessToken, `${protocol}://${host}/denied`)

        console.log('~~~~~~ Chris Debug ~~~~~~ 51', '')
        clearSessionDown(request, h)
        console.log('~~~~~~ Chris Debug ~~~~~~ 52', '')

        return h.redirect(result)
      }

      request.cookieAuth.set({
        scope: [enforcement],
        account: {
          userId: user.id, // eslint-disable-line dot-notation
          displayname: user.username,
          username: user.username,
          accessToken: user.accessToken,
          idToken: user.id
        }
      })

      const redirectRoute = await getRedirectForUserAccess(request, user)
      if (redirectRoute) {
        return h.redirect(redirectRoute)
      }

      setInSession(request, keys.acceptedLicence, null)
      setInSession(request, keys.loggedInForNavRoutes, 'Y')

      return h.redirect(determineRedirectUrl(getFromSession(request, 'returnUrl')))
    } catch (err) {
      console.error('Error authenticating:', err)
    }

    return h.view('500').code(500)
  }
}
