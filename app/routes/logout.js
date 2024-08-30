const { getAuth } = require('../auth/openid-auth')
const getUser = require('../auth/get-user')
const { userLogout } = require('../api/ddi-index-api/user')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: async (request, h) => {
    const user = getUser(request)

    try {
      await userLogout(user)
    } catch (e) {
      console.error('Attempt to invalid cache failed', e)
    }

    const idToken = request.state['session-auth']?.account.idToken
    const auth = await getAuth()
    const logoutRes = await auth.client.endSessionUrl({
      id_token_hint: idToken,
      post_logout_redirect_uri: auth.configuration.postLogoutUri
    })
    request.cookieAuth.clear()
    h.unstate('nonce')
    h.unstate('state')

    return h.redirect(logoutRes)
  }
}
