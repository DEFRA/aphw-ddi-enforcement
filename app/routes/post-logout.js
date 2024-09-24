module.exports = {
  method: 'GET',
  path: '/post-logout',
  options: {
    auth: false
  },
  handler: async (_request, h) => {
    return h.view('post-logout')
  }
}
