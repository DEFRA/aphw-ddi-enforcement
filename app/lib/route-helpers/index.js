const { useManageCdo, redirectManageCdo } = require('./cdo')
const { throwIfPreConditionError, getContextNav, isUrlEndingFromList, concatUrlParams } = require('./shared')
const { getRedirectForUserAccess, licenseNotValid, getPoliceForceName } = require('./user')

module.exports = {
  useManageCdo,
  redirectManageCdo,
  throwIfPreConditionError,
  getRedirectForUserAccess,
  getContextNav,
  isUrlEndingFromList,
  licenseNotValid,
  getPoliceForceName,
  concatUrlParams
}
