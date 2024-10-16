const { createBearerHeader } = require('../auth/jwt-utils')
const addHeaders = (user, audience = 'aphw-ddi-api') => {
  return {
    'ddi-username': user?.username,
    'ddi-displayname': user?.displayname,
    ...createBearerHeader(audience)(user)
  }
}

module.exports = {
  addHeaders
}
