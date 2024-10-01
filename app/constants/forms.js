const constants = {
  errorCodes: {
    validationError: 400
  },
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
    },
    secureAccessLicenceView: {
      get: '/secure-access-licence-view',
      post: '/secure-access-licence-view'
    },
    verifyCode: {
      get: '/verify-code',
      post: '/verify-code'
    }
  },
  views: {
    privacyNotice: 'privacy-notice',
    termsAndConditions: 'terms-and-conditions',
    secureAccessLicenceAgree: 'secure-access-licence-agree',
    secureAccessLicenceView: 'secure-access-licence-view',
    verifyCode: 'verify-code'
  },
  keys: {
    acceptedLicence: 'accepted-licence'
  }
}

module.exports = constants
