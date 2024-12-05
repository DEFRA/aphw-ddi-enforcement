const constants = require('../../constants/forms')
const { getFromSession } = require('../../session/session-wrapper')
const throwIfPreConditionError = (request) => {
  for (const [key, value] of Object.entries(request.pre ?? {})) {
    if (value instanceof Error) {
      console.error(`Failed at pre step ${key}`, value)
      throw value
    }
  }
}

const pathsForRoot = [
  constants.routes.secureAccessLicence.get,
  constants.routes.verifyCode.get,
  constants.routes.postLogout.get,
  constants.routes.postLogoutWithFeedback.get
]

const getContextNav = (request) => {
  const loggedIn = getFromSession(request, constants.keys.loggedInForNavRoutes) === 'Y'
  const homeLink = loggedIn && !pathsForRoot.includes(request.url?.path)
    ? '/cdo/search/basic'
    : '/'
  const signOutLink = loggedIn && !pathsForRoot.includes(request.url?.path)
    ? '/feedback?logout=true'
    : '/logout'
  return {
    sessionIsLoggedIn: loggedIn,
    homeLink,
    signOutLink
  }
}

const isUrlEndingFromList = (url, endingsToExclude) => {
  let found = false
  for (const ending of endingsToExclude) {
    if (url.endsWith(ending)) {
      found = true
      break
    }
  }
  return found
}

module.exports = {
  throwIfPreConditionError,
  getContextNav,
  isUrlEndingFromList
}
