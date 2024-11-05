const constants = require('../constants/forms')
const { getFromSession, setInSession } = require('../session/session-wrapper')
const { isLicenceValid, isEmailVerified, sendVerifyEmail } = require('../api/ddi-index-api/user')

const throwIfPreConditionError = (request) => {
  for (const [key, value] of Object.entries(request.pre ?? {})) {
    if (value instanceof Error) {
      console.error(`Failed at pre step ${key}`, value)
      throw value
    }
  }
}

const getRedirectForUserAccess = async (request, user) => {
  const notValid = await licenseNotValid(request, user)

  if (notValid) {
    return constants.routes.secureAccessLicence.get
  }

  const verified = await isEmailVerified(user)

  if (!verified) {
    await sendVerifyEmail(user)
    return constants.routes.verifyCode.get
  }

  return null
}

const licenseNotValid = async (request, user) => {
  const valid = getFromSession(request, constants.keys.validLicence)

  if (valid === 'Y') {
    return false
  }

  const acceptedDb = await isLicenceValid(user)

  if (acceptedDb.valid) {
    setInSession(request, constants.keys.acceptedLicence, 'Y')
    setInSession(request, constants.keys.validLicence, 'Y')
    return false
  }

  if (acceptedDb.accepted) {
    setInSession(request, constants.keys.acceptedLicence, 'Y')
  }

  return true
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
  getRedirectForUserAccess,
  getContextNav,
  isUrlEndingFromList,
  licenseNotValid
}
