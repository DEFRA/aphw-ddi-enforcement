const { throwIfPreConditionError, licenceNotYetAccepted, checkUserAccess } = require('../../../app/lib/route-helpers')

jest.mock('../../../app/session/session-wrapper')
const { getFromSession, setInSession } = require('../../../app/session/session-wrapper')

jest.mock('../../../app/api/ddi-index-api/user')
const { isLicenceAccepted, isEmailVerified, sendVerifyEmail } = require('../../../app/api/ddi-index-api/user')

beforeEach(() => {
  jest.clearAllMocks()
  setInSession.mockReturnValue()
  sendVerifyEmail.mockResolvedValue()
})

describe('throwIfPreConditionError', () => {
  test('should throw an error if any of the pre conditions throw an error', () => {
    const request = {
      pre: {
        step1: new Error('some error')
      }
    }
    expect(() => throwIfPreConditionError(request)).toThrow('some error')
  })

  test('should not throw an error if the pre conditions pass', () => {
    const request = {
      pre: {
        step1: 'success'
      }
    }
    expect(() => throwIfPreConditionError(request)).not.toThrow()
  })

  test('should not throw an error if no pre exists', () => {
    const request = {}
    expect(() => throwIfPreConditionError(request)).not.toThrow()
  })
})

describe('licenceNotYetAccepted', () => {
  test('should return false if already accepted in session', async () => {
    getFromSession.mockReturnValue('Y')
    expect(await licenceNotYetAccepted({}, {})).toBeFalsy()
  })

  test('should return false if not accepted in session but accepted in DB', async () => {
    getFromSession.mockReturnValue()
    isLicenceAccepted.mockResolvedValue(true)
    expect(await licenceNotYetAccepted({}, {})).toBeFalsy()
  })

  test('should return true if not accepted in session and not accepted in DB', async () => {
    getFromSession.mockReturnValue()
    isLicenceAccepted.mockResolvedValue(false)
    expect(await licenceNotYetAccepted({}, {})).toBeTruthy()
  })
})

describe('checkUserAccess', () => {
  test('should return null if already accepted and email verified', async () => {
    getFromSession.mockReturnValue('Y')
    isEmailVerified.mockResolvedValue(true)
    expect(await checkUserAccess({}, {})).toBeFalsy()
  })

  test('should return null if not accepted in session but accepted in DB', async () => {
    getFromSession.mockReturnValue()
    isLicenceAccepted.mockResolvedValue(true)
    isEmailVerified.mockResolvedValue(true)
    expect(await checkUserAccess({}, {})).toBe(null)
  })

  test('should return url if not accepted in session and not accepted in DB', async () => {
    getFromSession.mockReturnValue()
    isLicenceAccepted.mockResolvedValue(false)
    isEmailVerified.mockResolvedValue(false)
    expect(await checkUserAccess({}, {})).toBe('/secure-access-licence')
  })

  test('should return url if not verified', async () => {
    getFromSession.mockReturnValue()
    isLicenceAccepted.mockResolvedValue(true)
    isEmailVerified.mockResolvedValue(false)
    expect(await checkUserAccess({}, {})).toBe('/verify-code')
  })
})
