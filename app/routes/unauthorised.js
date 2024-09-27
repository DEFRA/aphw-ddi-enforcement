const UNAUTHORISED = 401

module.exports = {
  method: 'GET',
  path: '/unauthorised',
  options: {
    auth: false
  },
  handler: (request, h) => {
    request.cookieAuth.clear()
    h.unstate('nonce')
    h.unstate('state')
    request.yar.reset()

    return h.view('unauthorized').code(UNAUTHORISED)
  }
}
