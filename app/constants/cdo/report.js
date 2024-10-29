const constants = {
  reportTypes: {
    inBreach: 'in-breach',
    changedAddress: 'changed-address',
    dogDied: 'dog-died',
    somethingElse: 'something-else'
  },
  routes: {
    reportType: {
      get: '/cdo/report/report-type',
      post: '/cdo/report/report-type'
    },
    breachReasons: {
      get: '/cdo/report/breach-reasons',
      post: '/cdo/report/breach-reasons'
    },
    postcodeLookup: {
      get: '/cdo/report/postcode-lookup',
      post: '/cdo/report/postcode-lookup'
    },
    selectAddress: {
      get: '/cdo/report/select-address',
      post: '/cdo/report/select-address'
    },
    address: {
      get: '/cdo/report/address',
      post: '/cdo/report/address'
    },
    selectDog: {
      get: '/cdo/report/select-dog',
      post: '/cdo/report/select-dog'
    },
    dogDied: {
      get: '/cdo/report/dog-died',
      post: '/cdo/report/dog-died'
    },
    somethingElse: {
      get: '/cdo/report/something-else',
      post: '/cdo/report/something-else'
    },
    reportConfirmation: {
      get: '/cdo/report/confirmation'
    }
  },
  views: {
    reportType: 'cdo/report/report-type',
    breachReasons: 'cdo/report/breach-reasons',
    postcodeLookup: 'cdo/report/postcode-lookup',
    selectAddress: 'cdo/report/select-address',
    address: 'cdo/report/address',
    selectDog: 'cdo/report/select-dog',
    dogDied: 'cdo/report/dog-died',
    somethingElse: 'cdo/report/something-else',
    reportConfirmation: 'cdo/report/confirmation'
  },
  keys: {
    entry: 'report',
    reportType: 'reportType',
    dateOfDeath: 'dateOfDeath',
    postcodeLookup: 'postcodeLookup',
    address: 'address',
    addresses: 'addresses'
  }
}

module.exports = constants
