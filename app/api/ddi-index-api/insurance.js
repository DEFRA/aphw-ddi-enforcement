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

const getCompanies = async () => {
  const payload = await get(insuranceCompaniesEndpoint, options)

  return payload.companies
}

const getCompaniesNewest = async () => {
  const payload = await get(`${insuranceCompaniesEndpoint}?sortKey=updatedAt&sortOrder=DESC`, options)

  return payload.companies
}

module.exports = {
  getCompanies,
  getCompaniesNewest
}
