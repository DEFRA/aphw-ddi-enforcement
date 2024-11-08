const { throwIfPreConditionError, licenceNotYetAccepted, getRedirectForUserAccess, getContextNav, isUrlEndingFromList } = require('../../../app/lib/route-helpers')

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

describe('getRedirectForUserAccess', () => {
  test('should return null if already accepted and email verified', async () => {
    getFromSession.mockReturnValue('Y')
    isEmailVerified.mockResolvedValue(true)
    expect(await getRedirectForUserAccess({}, {})).toBeFalsy()
  })

  test('should return null if not accepted in session but accepted in DB', async () => {
    getFromSession.mockReturnValue()
    isLicenceAccepted.mockResolvedValue(true)
    isEmailVerified.mockResolvedValue(true)
    expect(await getRedirectForUserAccess({}, {})).toBe(null)
  })

  test('should return url if not accepted in session and not accepted in DB', async () => {
    getFromSession.mockReturnValue()
    isLicenceAccepted.mockResolvedValue(false)
    isEmailVerified.mockResolvedValue(false)
    expect(await getRedirectForUserAccess({}, {})).toBe('/secure-access-licence')
  })

  test('should return url if not verified', async () => {
    getFromSession.mockReturnValue()
    isLicenceAccepted.mockResolvedValue(true)
    isEmailVerified.mockResolvedValue(false)
    expect(await getRedirectForUserAccess({}, {})).toBe('/verify-code')
  })
})

describe('getContextNav', () => {
  test('should return loggedIn paths', async () => {
    getFromSession.mockReturnValue('Y')
    const nav = getContextNav({})
    expect(nav.sessionIsLoggedIn).toBeTruthy()
    expect(nav.homeLink).toBe('/cdo/search/basic')
    expect(nav.signOutLink).toBe('/feedback?logout=true')
  })

  test('should return not loggedIn paths', async () => {
    getFromSession.mockReturnValue()
    const nav = getContextNav({})
    expect(nav.sessionIsLoggedIn).toBeFalsy()
    expect(nav.homeLink).toBe('/')
    expect(nav.signOutLink).toBe('/logout')
  })

  test('should handle excluded paths', async () => {
    getFromSession.mockReturnValue('Y')
    const nav = getContextNav({ url: { path: '/verify-code' } })
    expect(nav.sessionIsLoggedIn).toBeTruthy()
    expect(nav.homeLink).toBe('/')
    expect(nav.signOutLink).toBe('/logout')
  })
})

describe('isUrlEndingFromList', () => {
  test('should return false when path ending doesnt match', async () => {
    expect(isUrlEndingFromList('https://host.com/12345', ['/23456', '/1345', '/22345'])).toBeFalsy()
  })

  test('should return true when path ending matches', async () => {
    expect(isUrlEndingFromList('https://host.com/12345', ['/23456', '/2345', '/12345'])).toBeTruthy()
  })

  test('should return true when path ending matches multiple times', async () => {
    expect(isUrlEndingFromList('https://host.com/12345', ['/123456', '/12345', '/12345', '/123'])).toBeTruthy()
  })
})
