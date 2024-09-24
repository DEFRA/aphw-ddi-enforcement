const { getFromSession, setInSession } = require('../session/session-wrapper')
const { validateLicence } = require('../api/ddi-index-api/user')

const throwIfPreConditionError = (request) => {
  for (const [key, value] of Object.entries(request.pre ?? {})) {
    if (value instanceof Error) {
      console.error(`Failed at pre step ${key}`, value)
      throw value
    }
  }
}

const licenceNotYetAccepted = async (request, user) => {
  const accepted = getFromSession(request, 'acceptedLicence')

  if (accepted === 'Y') {
    return false
  }

  const acceptedDb = await validateLicence(user)
  if (acceptedDb) {
    setInSession(request, 'acceptedLicence', 'Y')
    return false
  }

  return true
}

module.exports = {
  throwIfPreConditionError,
  licenceNotYetAccepted
}
