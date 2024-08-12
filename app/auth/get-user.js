const getUser = (request) => {
  return {
    userId: request.auth.credentials?.account?.userId,
    displayname: request.auth.credentials?.account?.displayname,
    username: request.auth.credentials?.account?.username
  }
}

module.exports = getUser
