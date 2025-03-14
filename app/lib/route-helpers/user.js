const constants = require('../../constants/forms')
const { isEmailVerified, sendVerifyEmail, isLicenceValid, getPoliceForceDisplayName } = require('../../api/ddi-index-api/user')
const { getFromSession, setInSession } = require('../../session/session-wrapper')
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

const getPoliceForceName = async (request, user) => {
  let policeForceName = getFromSession(request, constants.keys.policeForceDisplayName)

  if (!policeForceName) {
    policeForceName = await getPoliceForceDisplayName(user)
    setInSession(request, constants.keys.policeForceDisplayName, policeForceName)
  }

  return policeForceName
}

module.exports = {
  licenseNotValid,
  getRedirectForUserAccess,
  getPoliceForceName
}
