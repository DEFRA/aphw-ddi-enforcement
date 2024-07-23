jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')

const { getCourts } = require('../../../../app/api/ddi-index-api/courts')

describe('DDI API courts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCourts', () => {
    test('should get courts', async () => {
      const courts = [{ id: 1, name: 'Test court' }]
      get.mockResolvedValue({
        courts
      })

      const gotCourts = await getCourts()
      expect(gotCourts).toEqual(courts)
      expect(get).toHaveBeenCalledWith('courts', { json: true })
    })
  })
})
