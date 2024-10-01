module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: false,
    handler: async (_request, h) => {
      // Do not put any session management calls here as it can mess up cookie operations
      return h.view('index')
    }
  }
}
