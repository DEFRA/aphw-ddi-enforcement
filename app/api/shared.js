const { createBearerHeader } = require('../auth/jwt-utils')
const addHeaders = (user, _request) => {
  return {
    'ddi-username': user?.username,
    'ddi-displayname': user?.displayname,
    ...createBearerHeader('aphw-ddi-api')(user)
  }
}

module.exports = {
  addHeaders
}
