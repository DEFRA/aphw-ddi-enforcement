const { get } = require('./base')

const dogBreachesEndpoint = 'breaches'

/**
 * @typedef BreachCategory
 * @property {number} id
 * @property {string} label
 * @property {string} short_name
 */

/**
 * @return {Promise<BreachCategory[]>}
 */
const getBreachCategories = async (user) => {
  const payload = await get(`${dogBreachesEndpoint}/categories`, user)

  return payload.breachCategories.map(breachCategory => {
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
