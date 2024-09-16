const { user } = require('../../../mocks/auth')

describe('Persons test', () => {
  const { getPersons } = require('../../../../app/api/ddi-index-api/persons')
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPersons', () => {
    test('should get people filtered by firstName and lastName', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson'
      }, user)
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', user)
    })

    test('should get people filtered by firstName and lastName and filter dobDay, dobMonth, dobYear', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        dobDay: '',
        dobMonth: '',
        dobYear: ''
      }, user)
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', user)
    })

    test('should get people filtered by firstName and lastName and DOB', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        dateOfBirth: '1998-05-10',
        dobDay: '10',
        dobMonth: '05',
        dobYear: '1998'
      }, user)
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson&dateOfBirth=1998-05-10', user)
    })

    test('should get people filtered by firstName and lastName and DOB as Date', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        dateOfBirth: new Date('1998-05-10'),
        dobDay: '10',
        dobMonth: '05',
        dobYear: '1998'
      }, user)
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson&dateOfBirth=1998-05-10', user)
    })

    test('should throw an error given empty object', async () => {
      get.mockResolvedValue({ payload: {} })
      await expect(getPersons({}, user)).rejects.toThrow('ValidationError: "value" must contain at least one of [firstName, orphaned]')
    })

    test('should strip invalid query params', async () => {
      get.mockResolvedValue({ payload: {} })
      await expect(getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        queryParam: '1234'
      }, user))
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', user)
    })
  })
})
