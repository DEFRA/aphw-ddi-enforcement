const { getAuth } = require('./openid-auth')
const logoutUser = async (idToken, customUrl) => {
  const auth = await getAuth()

  return auth.client.endSessionUrl({
    id_token_hint: idToken,
    post_logout_redirect_uri: customUrl || auth.configuration.postLogoutUri
  })
}

module.exports = {
  logoutUser
}
