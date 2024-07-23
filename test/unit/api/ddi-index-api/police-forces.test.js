jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')

const { getPoliceForces } = require('../../../../app/api/ddi-index-api/police-forces')

describe('DDI API policeForces', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPoliceForces', () => {
    test('should get courts', async () => {
      const policeForces = [{
        id: 1,
        name: 'Isengard Constabulary'
      }]
      get.mockResolvedValue({
        policeForces
      })

      const gotPoliceForces = await getPoliceForces()
      expect(gotPoliceForces).toEqual(policeForces)
      expect(get).toHaveBeenCalledWith('police-forces', { json: true })
    })
  })
})
