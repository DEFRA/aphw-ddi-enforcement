module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: false,
    handler: async (_request, h) => {
      return h.view('index')
    }
  }
}
