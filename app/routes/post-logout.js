
module.exports = {
  method: 'GET',
  path: '/post-logout',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    return h.view('post-logout')
  }
}
