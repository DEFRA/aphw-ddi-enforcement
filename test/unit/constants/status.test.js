const { statuses } = require('../../../app/constants/cdo/status')

describe('statuses', () => {
  test('should correctly map statuses', () => {
    expect(statuses.Exempt).toBe('Exempt')
    expect(statuses.Exempt).toBe('Exempt')
    expect(statuses.Failed).toBe('Failed')
    expect(statuses.Inactive).toBe('Inactive')
    expect(statuses.InterimExempt).toBe('Interim exempt')
    expect(statuses.InBreach).toBe('In breach')
    expect(statuses.PreExempt).toBe('Pre-exempt')
    expect(statuses.Withdrawn).toBe('Withdrawn')
  })
})
