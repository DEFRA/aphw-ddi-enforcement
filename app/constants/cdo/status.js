/**
 * @type {{
 *    Exempt: string,
 *    Failed: string,
 *    Inactive: string,
 *    PreExempt: string,
 *    Withdrawn: string,
 *    InterimExempt: string,
 *    InBreach: string
 * }}
 */
const statuses = {
  Exempt: 'Exempt',
  Failed: 'Failed',
  Inactive: 'Inactive',
  InterimExempt: 'Interim exempt',
  InBreach: 'In breach',
  PreExempt: 'Pre-exempt',
  Withdrawn: 'Withdrawn'
}

const inactiveSubStatuses = {
  dead: 'Dog dead',
  exported: 'Dog exported',
  stolen: 'Reported stolen',
  untraceable: 'Owner untraceable'
}

module.exports = {
  statuses,
  inactiveSubStatuses
}
