const getUser = require('../auth/get-user')
const { userLogout } = require('../api/ddi-index-api/user')
const { logoutUser } = require('../auth/logout')
const { clearSessionDown } = require('../session/session-wrapper')

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

    const logoutRes = await logoutUser(idToken, null, request?.query?.feedback ? '?feedback=true' : '')

    clearSessionDown(request, h)

    return h.redirect(logoutRes)
  }
}
