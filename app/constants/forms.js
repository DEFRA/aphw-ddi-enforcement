const constants = {
  forms: {
    preventAutocomplete: 'one-time-code'
  },
  routes: {
    privacyNotice: {
      get: '/privacy-notice'
    },
    termsAndConditions: {
      get: '/terms-and-conditions'
    },
    secureAccessLicence: {
      get: '/secure-access-licence',
      post: '/secure-access-licence'
    }
  },
  views: {
    privacyNotice: 'privacy-notice',
    termsAndConditions: 'terms-and-conditions',
    secureAccessLicence: 'secure-access-licence'
  }
}

module.exports = constants
