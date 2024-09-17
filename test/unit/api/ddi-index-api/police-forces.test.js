jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')

const { getPoliceForces } = require('../../../../app/api/ddi-index-api/police-forces')
const { user } = require('../../../mocks/auth')

describe('DDI API policeForces', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPoliceForces', () => {
    test('should get police forces', async () => {
      const policeForces = [{
        id: 1,
        name: 'Isengard Constabulary'
      }]
      get.mockResolvedValue({
        policeForces
      })

      const gotPoliceForces = await getPoliceForces(user)
      expect(gotPoliceForces).toEqual(policeForces)
      expect(get).toHaveBeenCalledWith('police-forces', user)
    })
  })
})
