const { getTaskDetails } = require('../../../../../../app/routes/cdo/manage/tasks/generic-task-helper')
describe('Generic Task Helper test', () => {
  describe('getTaskDetails', () => {
    test('throws error if invalid task', () => {
      expect(() => getTaskDetails('invalid')).toThrow('Invalid task invalid when getting details')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
