const { user } = require('../../mocks/auth')

jest.mock('../../../app/api/ddi-index-api/person')
const { getPersonAndDogs } = require('../../../app/api/ddi-index-api/person')

jest.mock('../../../app/api/ddi-index-api/cdo')
const { getCdo } = require('../../../app/api/ddi-index-api/cdo')

const { getCdoOrPerson, determineScreenAfterReportType, determineScreenAfterSelectDog, isSessionValid } = require('../../../app/lib/report-helper')

describe('Report helper', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    getCdo.mockResolvedValue()
    getPersonAndDogs.mockResolvedValue()
  })

  describe('isSessionValid', () => {
    test('should return false if missing pk and sourceType', () => {
      const request = { }
      expect(isSessionValid(request)).toBeFalsy()
    })

    test('should return false if missing pk', () => {
      const request = { sourceType: 'dog' }
      expect(isSessionValid(request)).toBeFalsy()
    })

    test('should return false if pk is empty string', () => {
      const request = { sourceType: 'dog', pk: '' }
      expect(isSessionValid(request)).toBeFalsy()
    })

    test('should return false if missing sourceType', () => {
      const request = { pk: 'ED123' }
      expect(isSessionValid(request)).toBeFalsy()
    })

    test('should return false if sourceType is empty string', () => {
      const request = { sourceType: '', pk: 'ED123' }
      expect(isSessionValid(request)).toBeFalsy()
    })

    test('should return true if sourceType and pk are present and not empty strings', () => {
      const request = { sourceType: 'dog', pk: 'ED123' }
      expect(isSessionValid(request)).toBeTruthy()
    })
  })

  describe('getCdoOrPerson', () => {
    test('should handle missing pk', async () => {
      const res = await getCdoOrPerson('dog', null, user)
      expect(res).toBe(null)
      expect(getCdo).not.toHaveBeenCalled()
      expect(getPersonAndDogs).not.toHaveBeenCalled()
    })

    test('should handle missing sourceType', async () => {
      const res = await getCdoOrPerson(null, 'ED123', user)
      expect(res).toBe(null)
      expect(getCdo).not.toHaveBeenCalled()
      expect(getPersonAndDogs).not.toHaveBeenCalled()
    })

    test('should call getCdo if dog', async () => {
      await getCdoOrPerson('dog', 'ED123', user)
      expect(getCdo).toHaveBeenCalledWith('ED123', user)
      expect(getPersonAndDogs).not.toHaveBeenCalled()
    })

    test('should call getPersonByReference if owner', async () => {
      await getCdoOrPerson('owner', 'P-123', user)
      expect(getPersonAndDogs).toHaveBeenCalledWith('P-123', user)
      expect(getCdo).not.toHaveBeenCalled()
    })
  })

  describe('determineScreenAfterReportType', () => {
    test('should handle in-breach with one dog', async () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }] })
      const details = { sourceType: 'dog' }
      const backNav = { srcHashParam: '?src=hash1' }
      const res = await determineScreenAfterReportType('in-breach', details, backNav, user)
      expect(res).toEqual({
        nextScreen: '/cdo/report/breach-reasons?src=hash1',
        override: undefined
      })
    })

    test('should handle in-breach with multiple dogs', async () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }, { indexNumber: 'ED333' }] })
      const details = { sourceType: 'owner' }
      const backNav = { srcHashParam: '?src=hash1' }
      const res = await determineScreenAfterReportType('in-breach', details, backNav, user)
      expect(res).toEqual({
        nextScreen: '/cdo/report/select-dog?src=hash1',
        override: undefined
      })
    })

    test('should handle changed-address', async () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }] })
      const details = { sourceType: 'owner' }
      const backNav = { srcHashParam: '?src=hash1' }
      const res = await determineScreenAfterReportType('changed-address', details, backNav, user)
      expect(res).toEqual({
        nextScreen: '/cdo/report/postcode-lookup?src=hash1',
        override: undefined
      })
    })

    test('should handle dog-died with one dog', async () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }] })
      const details = { sourceType: 'owner' }
      const backNav = { srcHashParam: '?src=hash1' }
      const res = await determineScreenAfterReportType('dog-died', details, backNav, user)
      expect(res).toEqual({
        nextScreen: '/cdo/report/dog-died?src=hash1',
        override: { indexNumber: 'ED222' }
      })
    })

    test('should handle dog-died with multiple dogs', async () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }, { indexNumber: 'ED333' }] })
      const details = { sourceType: 'owner' }
      const backNav = { srcHashParam: '?src=hash1' }
      const res = await determineScreenAfterReportType('dog-died', details, backNav, user)
      expect(res).toEqual({
        nextScreen: '/cdo/report/select-dog?src=hash1',
        override: undefined
      })
    })

    test('should handle something-else', async () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }] })
      const details = { sourceType: 'dog' }
      const backNav = { srcHashParam: '?src=hash1' }
      const res = await determineScreenAfterReportType('something-else', details, backNav, user)
      expect(res).toEqual({
        nextScreen: '/cdo/report/something-else?src=hash1',
        override: undefined
      })
    })
  })

  describe('determineScreenAfterSelectDog', () => {
    test('should handle in-breach', () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }] })
      const backNav = { srcHashParam: '?src=hash1' }
      const res = determineScreenAfterSelectDog('in-breach', backNav)
      expect(res).toBe('/cdo/report/breach-reasons?src=hash1')
    })

    test('should handle dog-died', () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }] })
      const backNav = { srcHashParam: '?src=hash1' }
      const res = determineScreenAfterSelectDog('dog-died', backNav)
      expect(res).toBe('/cdo/report/dog-died?src=hash1')
    })

    test('should handle something-else', () => {
      getPersonAndDogs.mockResolvedValue({ dogs: [{ indexNumber: 'ED222' }] })
      const backNav = { srcHashParam: '?src=hash1' }
      const res = determineScreenAfterSelectDog('something-else', backNav)
      expect(res).toBe('/cdo/report/something-else?src=hash1')
    })
  })
})
