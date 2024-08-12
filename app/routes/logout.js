const { getAuth } = require('../auth/openid-auth')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: async (request, h) => {
    const idToken = request.state['session-auth']?.account.token
    const auth = await getAuth()
    const logoutRes = await auth.client.endSessionUrl({
      id_token_hint: idToken,
      post_logout_redirect_uri: auth.configuration.postLogoutUri
    })
    request.cookieAuth.clear()
    h.unstate('nonce')
    h.unstate('state')

    // request.nonce.clear()
    // request.state.clear()

    return h.redirect(logoutRes)
  }
}
