const { getOldDogs } = require('../../../../app/api/ddi-index-api/dogs')

jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')
const { user } = require('../../../mocks/auth')

describe('Dogs test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getOldDogs calls endpoint with valid params when no sort passed', async () => {
    get.mockResolvedValue()
    await getOldDogs('Exempt,In breach', user)
    expect(get).toHaveBeenCalledWith('dogs?forPurging=true&statuses=Exempt,In breach&sortKey=status&sortOrder=ASC', user)
  })

  test('getOldDogs calls endpoint with override', async () => {
    get.mockResolvedValue()
    await getOldDogs('Exempt,In breach', user, {}, '2038-05-01')
    expect(get).toHaveBeenCalledWith('dogs?forPurging=true&statuses=Exempt,In breach&sortKey=status&sortOrder=ASC&today=2038-05-01', user)
  })
})
