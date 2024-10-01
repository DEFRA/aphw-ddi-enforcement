const constants = require('../constants/forms')
const { getFromSession, setInSession } = require('../session/session-wrapper')
const { isLicenceAccepted, isEmailVerified, sendVerifyEmail } = require('../api/ddi-index-api/user')

const throwIfPreConditionError = (request) => {
  for (const [key, value] of Object.entries(request.pre ?? {})) {
    if (value instanceof Error) {
      console.error(`Failed at pre step ${key}`, value)
      throw value
    }
  }
}

const checkUserAccess = async (request, user) => {
  const notAccepted = await licenceNotYetAccepted(request, user)
  if (notAccepted) {
    return constants.routes.secureAccessLicence.get
  }
  const verified = await isEmailVerified(user)
  if (!verified) {
    await sendVerifyEmail(user)
    return constants.routes.verifyCode.get
  }
  return null
}

const licenceNotYetAccepted = async (request, user) => {
  const accepted = getFromSession(request, constants.keys.acceptedLicence)

  if (accepted === 'Y') {
    return false
  }

  const acceptedDb = await isLicenceAccepted(user)
  if (acceptedDb) {
    setInSession(request, constants.keys.acceptedLicence, 'Y')
    return false
  }

  return true
}

module.exports = {
  throwIfPreConditionError,
  checkUserAccess,
  licenceNotYetAccepted
}
