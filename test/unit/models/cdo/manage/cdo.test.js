const { buildTaskListFromComplete, buildTaskListTasksFromComplete } = require('../../../../mocks/cdo/manage/tasks/builder')
const { buildCdo } = require('../../../../mocks/cdo/cdo')
describe('Manage cdo model', () => {
  test('should update the query params if there is no backnav srcHasParam', () => {
    const Model = require('../../../../../app/models/cdo/manage/cdo')
    const tasklist = buildTaskListFromComplete({
      tasks: {
        ...buildTaskListTasksFromComplete(),
        verificationDateRecorded: {
          available: true,
          completed: false,
          readonly: false,
          key: 'verificationDateRecorded'
        }
      },
      form2Submitted: undefined
    })
    const cdo = buildCdo()
    const model = new Model(tasklist, cdo, { backLink: '', srcHashParam: '' })
    expect(model.model.summaryList.rows.some(({ value }) => value.html && value.html.includes('/cdo/manage/task/submit-form-two/?clear=true'))).toBe(true)
  })
})
