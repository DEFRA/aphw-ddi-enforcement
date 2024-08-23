const getUser = (request) => {
  return {
    userId: request.auth.credentials?.account?.userId,
    displayname: request.auth.credentials?.account?.displayname,
    username: request.auth.credentials?.account?.username,
    idToken: request.auth.credentials?.account?.idToken,
    accessToken: request.auth.credentials?.account?.accessToken
  }
}

module.exports = getUser
