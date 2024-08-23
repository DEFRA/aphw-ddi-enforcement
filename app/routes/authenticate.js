const { getAuth, getRedirectUri, NONCE_COOKIE_NAME, STATE_COOKIE_NAME, getResult } = require('../auth/openid-auth')
const { hash } = require('../auth/openid-helper')
const { getFromSession } = require('../session/session-wrapper')

module.exports = {
  method: 'GET',
  path: '/authenticate',
  options: {
    auth: { mode: 'try' }
  },
  handler: async (request, h) => {
    try {
      if (request.query.error) {
        throw new Error(`${request.query.error} - ${request.query.error_description}`)
      }

      const auth = await getAuth()

      // Get all the parameters to pass to the token exchange endpoint
      const redirectUri =
        auth.configuration.callbackRedirectUri ||
        auth.configuration.redirectUri ||
        getRedirectUri(request)

      const convertedParams = {
        method: request.method.toUpperCase(),
        url: request.url.href
      }

      const params = auth.client.callbackParams(convertedParams)
      const nonce = request.state[NONCE_COOKIE_NAME]
      const state = request.state[STATE_COOKIE_NAME]

      // Exchange the access code in the url parameters for an access token.
      // The access token is used to authenticate the call to get userinfo.
      const tokenSet = await auth.client.callback(redirectUri, params, {
        state: hash(state),
        nonce: hash(nonce)
      })

      // Call the userinfo endpoint the retreive the results of the flow.
      const authResult = await getResult(auth.ivPublicKey, auth.client, tokenSet)
      console.log('authResult', authResult)

      const userinfo = JSON.parse(authResult.userinfo)
      const accessToken = authResult.accessToken.replace(/(^")|("$)/g, '')

      request.cookieAuth.set({
        scope: ['Dog.Index.Standard'],
        account: {
          userId: userinfo['sub'], // eslint-disable-line dot-notation
          displayname: userinfo.email,
          username: userinfo.email,
          accessToken,
          idToken: authResult.idToken
        }
      })

      const returnUrl = getFromSession(request, 'returnUrl')
      return h.redirect(returnUrl && returnUrl !== '' ? returnUrl : '/')
    } catch (err) {
      console.error('Error authenticating:', err)
    }

    return h.view('500').code(500)
  }
}
