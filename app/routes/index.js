// const { doRoundTrip } = require('../api/ddi-index-api/round-trip')
const { anyLoggedInUser } = require('../auth/permissions')
const { validateUser } = require('../api/ddi-index-api/user')
const { getUser } = require('../auth')
// const getUser = require('../auth/get-user')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      await validateUser(getUser(request))
      return h.view('index')
    }
  }
}
