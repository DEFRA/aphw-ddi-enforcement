const {
  getAddresses,
  setAddresses,
  getReportTypeDetails,
  setReportTypeDetails,
  clearReportSession
} = require('../../../app/session/report')

describe('report session helpers', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAddresses', () => {
    test('should get addresses given object exists', () => {
      const addresses = [{
        addressLine1: '1 Bag End',
        addressLine2: null,
        town: 'Hobbiton',
        county: 'The Shire',
        postcode: 'SH2 2AA'
      }]
      mockRequest.yar.get.mockReturnValue({
        addresses
      })
      const gotAddresses = getAddresses(mockRequest)
      expect(gotAddresses).toEqual(addresses)
    })

    test('should get addresses given none exists', () => {
      mockRequest.yar.get.mockReturnValue(undefined)
      const addresses = getAddresses(mockRequest)
      expect(addresses).toEqual([])
    })
  })

  describe('setAddresses', () => {
    test('should set addresses given one exists', () => {
      const addresses = [{
        addressLine1: '1 Bag End',
        addressLine2: 'Bagshot Row',
        town: 'Hobbiton',
        county: 'The Shire',
        postcode: 'SH2 2AA'
      }]
      const expectedAddresses = {
        ...addresses,
        addressLine1: '3 Bag End'
      }
      mockRequest.yar.get.mockReturnValue({
        addresses
      })
      setAddresses(mockRequest, expectedAddresses)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('report', { addresses: expectedAddresses })
    })
  })

  describe('getReportTypeDetails', () => {
    test('should get report type details given they exist', () => {
      const expectedReportTypeDetails = {
        sourceType: 'dog',
        pk: 'ED123000'
      }
      mockRequest.yar.get.mockReturnValue({
        reportType: expectedReportTypeDetails
      })
      const reportTypeDetails = getReportTypeDetails(mockRequest)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('report')
      expect(reportTypeDetails).toEqual(expectedReportTypeDetails)
    })
  })

  describe('setReportTypeDetails', () => {
    test('should get report type details given they exist', () => {
      const expectedReportTypeDetails = {
        sourceType: 'dog',
        pk: 'ED123000'
      }
      mockRequest.yar.get.mockReturnValue({
        reportType: expectedReportTypeDetails
      })
      setReportTypeDetails(mockRequest, expectedReportTypeDetails)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('report')
      expect(mockRequest.yar.set).toHaveBeenCalledWith('report', {
        reportType: expectedReportTypeDetails
      })
    })

    test('should get owner details given they exist', () => {
      const expectedReportTypeDetails = {
        sourceType: 'dog',
        pk: 'ED123000'
      }
      mockRequest.yar.get.mockReturnValue(undefined)
      setReportTypeDetails(mockRequest, expectedReportTypeDetails)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('report', {
        reportType: expectedReportTypeDetails
      })
    })
  })

  describe('clearReportSession', () => {
    test('should call session areas to clear down segements', () => {
      clearReportSession(mockRequest)
      expect(mockRequest.yar.set).toHaveBeenCalledTimes(2)
      expect(mockRequest.yar.set).toHaveBeenNthCalledWith(1, 'report', { reportType: null })
      expect(mockRequest.yar.set).toHaveBeenNthCalledWith(2, 'report', { addresses: null })
    })
  })
})
