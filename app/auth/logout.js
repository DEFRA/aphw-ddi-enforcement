const { getAuth } = require('./openid-auth')
const logoutUser = async (idToken) => {
  const auth = await getAuth()

  return auth.client.endSessionUrl({
    id_token_hint: idToken,
    post_logout_redirect_uri: auth.configuration.postLogoutUri
  })
}

module.exports = {
  logoutUser
}
