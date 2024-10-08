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
    },
    feedback: {
      get: '/feedback',
      post: '/feedback'
    },
    feedbackSent: {
      get: '/feedback-sent'
    },
    postLogout: {
      get: '/post-logout'
    },
    postLogoutWithFeedback: {
      get: '/post-logout-with-feedback'
    }
  },
  views: {
    privacyNotice: 'privacy-notice',
    secureAccessLicenceAgree: 'secure-access-licence-agree',
    secureAccessLicenceView: 'secure-access-licence-view',
    verifyCode: 'verify-code',
    feedback: 'feedback',
    feedbackSent: 'feedback-sent',
    postLogout: 'post-logout',
    postLogoutWithFeedback: 'post-logout-with-feedback'
  },
  keys: {
    acceptedLicence: 'accepted-licence',
    loggedInForNavRoutes: 'logged-in-for-nav-routes'
  }
}

module.exports = constants
