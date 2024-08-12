const { getAuth, buildAuthorizationUrl } = require('../auth/openid-auth')

module.exports = {
  method: 'GET',
  path: '/login',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    try {
      // Vector of trust for authentication
      const vtr = '[\'Cl.Cm\']'

      const auth = await getAuth()

      // Calculate the redirect URL the should be returned to after completing the OAuth flow
      const authorizationUrl = buildAuthorizationUrl(request, h, auth.client, vtr, undefined, request.query)

      // Redirect to the authorization server
      return h.redirect(authorizationUrl)
    } catch (err) {
      console.error('Error authenticating:', err)
    }

    return h.view('500').code(500)
  }
}
