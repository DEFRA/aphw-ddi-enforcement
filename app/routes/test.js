module.exports = {
  method: 'GET',
  path: '/test',
  options: {
    auth: false
  },
  handler: (request, h) => {
    return h.view('unauthorized').code(401)
  }
}
