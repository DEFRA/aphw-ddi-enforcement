const { get } = require('./base')

const insuranceEndpoint = 'insurance'
const insuranceCompaniesEndpoint = `${insuranceEndpoint}/companies`

const options = {
  json: true
}
/**
 * @typedef {{ id: number; name: string }} InsuranceCompany
 */
/**
 *
 * @return {Promise<InsuranceCompany[]>}
 */

const getCompanies = async (user) => {
  const payload = await get(insuranceCompaniesEndpoint, user)

  return payload.companies
}

const getCompaniesNewest = async (user) => {
  const payload = await get(`${insuranceCompaniesEndpoint}?sortKey=updatedAt&sortOrder=DESC`, user)

  return payload.companies
}

module.exports = {
  getCompanies,
  getCompaniesNewest
}
