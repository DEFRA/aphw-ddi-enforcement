const getUser = require('../auth/get-user')
const { userLogout } = require('../api/ddi-index-api/user')
const { logoutUser } = require('../auth/logout')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: async (request, h) => {
    const user = getUser(request)

    try {
      await userLogout(user)
    } catch (e) {
      console.error('Attempt to invalidate cache failed', e)
    }

    const idToken = request.state['session-auth']?.account.idToken

    const logoutRes = await logoutUser(idToken)

    request.cookieAuth.clear()
    h.unstate('nonce')
    h.unstate('state')

    return h.redirect(logoutRes)
  }
}
