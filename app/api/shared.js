const { createBearerHeader } = require('../auth/jwt-utils')
const { api } = require('../constants/audience')

const addHeaders = (user, audience = api) => {
  const userAgent = {}

  if (user?.userAgent) {
    userAgent['enforcement-user-agent'] = user.userAgent
  }

  return {
    'ddi-username': user?.username,
    'ddi-displayname': user?.displayname,
    ...createBearerHeader(audience)(user),
    ...userAgent
  }
}

module.exports = {
  addHeaders
}
