const { get } = require('./base')

const dogBreachesEndpoint = 'breaches'

/**
 * @typedef BreachCategory
 * @property {number} id
 * @property {string} label
 * @property {string} short_name
 */

const categoriesShortNamesForDisplay = [
  'NOT_ON_LEAD_OR_MUZZLED',
  'INSECURE_PLACE',
  'AWAY_FROM_ADDR_30_DAYS_IN_YR',
  'EXEMPTION_NOT_PROVIDED_TO_POLICE',
  'INSURANCE_NOT_PROVIDED_TO_POLICE',
  'MICROCHIP_NOT_READ_BY_POLICE',
  'SOLD_EXCHANGED_OR_GIFTED',
  'PERSON_UNDER_16_YEARS',
  'ABANDONED_OR_STRAY',
  'NEUTERING_DEADLINE_EXCEEDED',
  'CROSSED_BORDER'
]

/**
 * @return {Promise<BreachCategory[]>}
 */
const getBreachCategories = async (user) => {
  const payload = await get(`${dogBreachesEndpoint}/categories`, user)

  return payload.breachCategories
    .filter(cat => categoriesShortNamesForDisplay.includes(cat.short_name))
    .map(breachCategory => {
      const [firstLetter, ...restOfLetters] = breachCategory.label
      const label = firstLetter.toUpperCase() + restOfLetters.join('')

      return {
        ...breachCategory,
        label
      }
    })
}

module.exports = {
  getBreachCategories
}
