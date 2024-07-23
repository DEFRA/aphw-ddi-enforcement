const { get } = require('./base')

const dogBreachesEndpoint = 'breaches'

const options = {
  json: true
}

/**
 * @typedef BreachCategory
 * @property {number} id
 * @property {string} label
 * @property {string} short_name
 */

/**
 * @return {Promise<BreachCategory[]>}
 */
const getBreachCategories = async () => {
  const payload = await get(`${dogBreachesEndpoint}/categories`, options)

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
