const { getAuth } = require('./openid-auth')
const logoutUser = async (idToken, customUrl, params = null) => {
  const auth = await getAuth()

  const logoutUrl = customUrl || auth.configuration.postLogoutUri

  return auth.client.endSessionUrl({
    id_token_hint: idToken,
    post_logout_redirect_uri: params ? `${logoutUrl}${params}` : logoutUrl
  })
}

module.exports = {
  logoutUser
}
