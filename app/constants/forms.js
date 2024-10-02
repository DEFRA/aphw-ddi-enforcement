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
    verifyCode: {
      get: '/verify-code',
      post: '/verify-code'
    },
    feedback: {
      get: '/feedback',
      post: '/feedback'
    },
    feedbackSent: {
      get: '/feedback-sent'
    }
  },
  views: {
    privacyNotice: 'privacy-notice',
    termsAndConditions: 'terms-and-conditions',
    secureAccessLicence: 'secure-access-licence',
    verifyCode: 'verify-code',
    feedback: 'feedback',
    feedbackSent: 'feedback-sent'
  },
  keys: {
    acceptedLicence: 'accepted-licence'
  }
}

module.exports = constants
