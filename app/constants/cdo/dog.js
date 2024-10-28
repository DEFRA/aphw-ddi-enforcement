const constants = {
  routes: {
    viewDogDetails: {
      get: '/cdo/view/dog-details',
      post: '/cdo/view/dog-details'
    },
    viewActivities: {
      get: '/cdo/view/activity'
    },
    reportType: {
      get: '/cdo/report/report-type'
    }
  },
  views: {
    viewDogDetails: 'cdo/view/dog-details',
    viewDogActivities: 'cdo/view/check-activities',
    reportType: 'cdo/report/report-type'
  }
}

module.exports = constants
