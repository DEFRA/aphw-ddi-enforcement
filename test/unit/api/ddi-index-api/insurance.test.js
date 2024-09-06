const { user } = require('../../../mocks/auth')
describe('DDI API insuranceCompanys', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { getCompanies, getCompaniesNewest } = require('../../../../app/api/ddi-index-api/insurance')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCompanies', () => {
    test('should get companies', async () => {
      const expectedCompanies = [{ id: 1, name: 'Dogs Trust' }]
      get.mockResolvedValue({
        companies: expectedCompanies
      })

      const insuranceCompanies = await getCompanies(user)

      expect(get).toHaveBeenCalledWith('insurance/companies', user)
      expect(insuranceCompanies).toEqual(expectedCompanies)
    })
  })

  describe('getCompaniesNewest', () => {
    test('should get companies and sort by newest first', async () => {
      const expectedCompanies = [{ id: 1, name: 'Dogs Trust' }]
      get.mockResolvedValue({
        companies: expectedCompanies
      })

      const insuranceCompanies = await getCompaniesNewest(user)

      expect(get).toHaveBeenCalledWith('insurance/companies?sortKey=updatedAt&sortOrder=DESC', user)
      expect(insuranceCompanies).toEqual(expectedCompanies)
    })
  })
})
