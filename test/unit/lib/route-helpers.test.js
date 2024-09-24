const { throwIfPreConditionError, licenceNotYetAccepted } = require('../../../app/lib/route-helpers')

jest.mock('../../../app/session/session-wrapper')
const { getFromSession, setInSession } = require('../../../app/session/session-wrapper')

jest.mock('../../../app/api/ddi-index-api/user')
const { validateLicence } = require('../../../app/api/ddi-index-api/user')

beforeEach(() => {
  jest.clearAllMocks()
  setInSession.mockReturnValue()
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
    validateLicence.mockResolvedValue(true)
    expect(await licenceNotYetAccepted({}, {})).toBeFalsy()
  })

  test('should return true if not accepted in session and not accepted in DB', async () => {
    getFromSession.mockReturnValue()
    validateLicence.mockResolvedValue(false)
    expect(await licenceNotYetAccepted({}, {})).toBeTruthy()
  })
})
