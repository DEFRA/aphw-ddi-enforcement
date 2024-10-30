const constants = {
  routes: {
    viewDogDetails: {
      get: '/cdo/view/dog-details',
      post: '/cdo/view/dog-details'
    },
    viewActivities: {
      get: '/cdo/view/activity'
    }
  },
  views: {
    viewDogDetails: 'cdo/view/dog-details',
    viewDogActivities: 'cdo/view/check-activities'
  }
}

module.exports = constants
