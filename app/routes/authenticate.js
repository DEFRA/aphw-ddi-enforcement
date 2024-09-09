const auth = require('../auth')
const { getAuth, getRedirectUri, NONCE_COOKIE_NAME, STATE_COOKIE_NAME, getResult } = require('../auth/openid-auth')
const { hash } = require('../auth/openid-helper')
const { getFromSession } = require('../session/session-wrapper')
const { validateUser } = require('../api/ddi-index-api/user')
const { logoutUser } = require('../auth/logout')
const { enforcement } = require('../auth/permissions')

const determineRedirectUrl = returnUrl => {
  return returnUrl &&
    returnUrl !== '' &&
    !returnUrl.endsWith('/post-logout') &&
    !returnUrl.endsWith('/unauthorised')
    ? returnUrl
    : '/'
}

module.exports = {
  method: 'GET',
  path: '/authenticate',
  options: {
    auth: { mode: 'try' }
  },
  handler: async (request, h) => {
    try {
      console.log('auth type', auth.authType)
      if (auth.authType === 'dev') {
        await auth.authenticate(request.query.code, request.cookieAuth)
        return h.redirect('/')
      }

      if (request.query.error) {
        throw new Error(`${request.query.error} - ${request.query.error_description}`)
      }

      const authProvider = await getAuth()

      // Get all the parameters to pass to the token exchange endpoint
      const redirectUri =
        authProvider.configuration.callbackRedirectUri ||
        authProvider.configuration.redirectUri ||
        getRedirectUri(request)

      const convertedParams = {
        method: request.method.toUpperCase(),
        url: request.url.href
      }

      const params = authProvider.client.callbackParams(convertedParams)
      const nonce = request.state[NONCE_COOKIE_NAME]
      const state = request.state[STATE_COOKIE_NAME]

      // Exchange the access code in the url parameters for an access token.
      // The access token is used to authenticate the call to get userinfo.
      const tokenSet = await authProvider.client.callback(redirectUri, params, {
        state: hash(state),
        nonce: hash(nonce)
      })

      // Call the userinfo endpoint the retreive the results of the flow.
      const authResult = await getResult(authProvider.ivPublicKey, authProvider.client, tokenSet)

      const userinfo = JSON.parse(authResult.userinfo)
      const accessToken = authResult.accessToken.replace(/(^")|("$)/g, '')

      try {
        console.log('validating user 123')
        await validateUser({
          username: userinfo.email,
          displayname: userinfo.email,
          accessToken
        })
      } catch (_e) {
        console.log('thrown 123')
        const protocol = request.headers['x-forwarded-proto'] || request.server.info.protocol
        const host = request.headers.host
        const returnUrl = `${protocol}://${host}/unauthorised`

        const result = await logoutUser(authResult.idToken, returnUrl)

        h.unstate('nonce')
        h.unstate('state')

        return h.redirect(result)
      }

      request.cookieAuth.set({
        scope: [enforcement],
        account: {
          userId: userinfo['sub'], // eslint-disable-line dot-notation
          displayname: userinfo.email,
          username: userinfo.email,
          accessToken,
          idToken: authResult.idToken
        }
      })

      const returnUrl = getFromSession(request, 'returnUrl')
      return h.redirect(determineRedirectUrl(returnUrl))
    } catch (err) {
      console.error('Error authenticating:', err)
    }

    return h.view('500').code(500)
  }
}
