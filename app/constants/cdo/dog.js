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
    },
    download: {
      get: '/cdo/view/download',
      post: '/cdo/view/download'
    }
  },
  views: {
    viewDogDetails: 'cdo/view/dog-details',
    viewDogActivities: 'cdo/view/check-history',
    reportType: 'cdo/report/report-type',
    download: 'cdo/view/download'
  }
}

module.exports = constants
