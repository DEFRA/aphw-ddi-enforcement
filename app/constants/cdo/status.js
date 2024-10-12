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

module.exports = {
  statuses
}
