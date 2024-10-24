const auth = require('../auth')
const { VECTOR_OF_TRUST } = require('../auth/openid-auth')
const { setInSession } = require('../session/session-wrapper')

const INTERNAL_SERVER_ERROR = 500

module.exports = {
  method: 'GET',
  path: '/login',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    try {
      setInSession(request, 'returnUrl', request.query?.next)

      if (auth.authType === 'dev') {
        return h.redirect(auth.getAuthenticationUrl())
      }

      const authProvider = await auth.getAuth()

      // Calculate the redirect URL the should be returned to after completing the OAuth flow
      const authorizationUrl = authProvider.getAuthorizationUrl(request, h, authProvider.client, VECTOR_OF_TRUST, undefined, request.query)

      // Redirect to the authorization server
      return h.redirect(authorizationUrl)
    } catch (err) {
      console.error('Error authenticating:', err)
    }

    return h.view('500').code(INTERNAL_SERVER_ERROR)
  }
}
