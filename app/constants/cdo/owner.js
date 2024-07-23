const constants = {
  routes: {
    home: {
      get: '/'
    },
    viewOwnerDetails: {
      get: '/cdo/view/owner-details',
      post: '/cdo/view/owner-details'
    }
  },
  views: {
    home: '/',
    viewOwnerDetails: 'cdo/view/owner-details'
  }
}

module.exports = constants
