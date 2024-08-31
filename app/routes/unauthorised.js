module.exports = {
  method: 'GET',
  path: '/unauthorised',
  options: {
    auth: false
  },
  handler: (_request, h) => {
    return h.view('unauthorized').code(401)
  }
}
