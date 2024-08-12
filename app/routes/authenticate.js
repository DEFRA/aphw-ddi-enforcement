const { getAuth, getRedirectUri, NONCE_COOKIE_NAME, STATE_COOKIE_NAME, getResult } = require('../auth/openid-auth')
const { hash } = require('../auth/openid-helper')

module.exports = {
  method: 'GET',
  path: '/authenticate',
  options: {
    auth: { mode: 'try' }
  },
  handler: async (request, h) => {
    try {
      console.log('/authenticate here1')
      if (request.query.error) {
        throw new Error(`${request.query.error} - ${request.query.error_description}`)
      }
      console.log('/authenticate here2')

      const auth = await getAuth()

      // Get all the parameters to pass to the token exchange endpoint
      const redirectUri =
        auth.configuration.callbackRedirectUri ||
        auth.configuration.redirectUri ||
        getRedirectUri(request)

      console.log('/authenticate here3')
      const convertedParams = {
        method: request.method.toUpperCase(),
        url: request.url.href
      }
      console.log('/authenticate here4')
      const params = auth.client.callbackParams(convertedParams)
      console.log('cookies', request.state)
      const nonce = request.state[NONCE_COOKIE_NAME]
      const state = request.state[STATE_COOKIE_NAME]
      console.log('/authenticate here4.1 nonce', nonce)
      console.log('/authenticate here4.2 state', state)

      // Exchange the access code in the url parameters for an access token.
      // The access token is used to authenticate the call to get userinfo.
      console.log('/authenticate here5 redirectUri', redirectUri)
      console.log('/authenticate here6 params', params)
      const tokenSet = await auth.client.callback(redirectUri, params, {
        state: hash(state),
        nonce: hash(nonce)
      })
      console.log('/authenticate here7')

      // Call the userinfo endpoint the retreive the results of the flow.
      const authResult = await getResult(auth.ivPublicKey, auth.client, tokenSet)
      console.log('authResult2', authResult.idToken)
      const userinfo = JSON.parse(authResult.userinfo)
      request.cookieAuth.set({
        scope: ['Dog.Index.Standard'],
        account: {
          userId: userinfo['sub'], // eslint-disable-line dot-notation
          displayname: userinfo.email,
          username: userinfo.email,
          token: authResult.idToken
        }
      })

      return h.redirect('/')
    } catch (err) {
      console.error('Error authenticating:', err)
    }

    return h.view('500').code(500)
  }
}
