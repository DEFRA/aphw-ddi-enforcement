const { get } = require('./base')

const cdoEndpoint = 'cdo'

/**
 * @param indexNumber
 * @param user
 * @return {any}
 */
const getCdo = async (indexNumber, user) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}`, user)
  return payload.cdo
}

const getCdoFromActivities = async (indexNumber, user) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}?type=activity`, user)
  return payload.cdo
}

/**
 * @typedef CdoTaskDto
 * @property {string} key
 * @property {boolean} available
 * @property {boolean} completed
 * @property {boolean} readonly
 * @property {string|undefined} timestamp
 */
/**
 * @typedef CdoTaskListTasksDto
 * @property {CdoTaskDto} applicationPackSent
 * @property {CdoTaskDto} microchipNumberRecorded
 * @property {CdoTaskDto} applicationFeePaid
 * @property {CdoTaskDto} insuranceDetailsRecorded
 * @property {CdoTaskDto} form2Sent
 * @property {CdoTaskDto} verificationDateRecorded
 * @property {CdoTaskDto} certificateIssued
 */
/**
 * @typedef CdoVerificationOptions
 * @property {boolean} dogDeclaredUnfit
 * @property {boolean} neuteringBypassedUnder16
 * @property {boolean} allowDogDeclaredUnfit
 * @property {boolean} allowNeuteringBypass
 * @property {boolean} showNeuteringBypass
 */
/**
 * @typedef CdoSummary
 * @property {{ name: string }} dog
 * @property {{ cdoExpiry: Date|undefined }} exemption
 * @property {{ firstName: string; lastName: string }} person
 */
/**
 * @typedef CdoTaskListDto
 * @property {CdoTaskListTasksDto} tasks
 * @property {Date|undefined} applicationPackSent
 * @property {string|undefined} insuranceCompany
 * @property {Date|undefined} insuranceRenewal
 * @property {string|undefined} microchipNumber
 * @property {string|undefined} microchipNumber2
 * @property {Date|undefined} applicationFeePaid
 * @property {Date|undefined} form2Sent
 * @property {Date|undefined} neuteringConfirmation
 * @property {Date|undefined} microchipVerification
 * @property {Date|undefined} microchipDeadline
 * @property {Date|undefined} certificateIssued
 * @property {CdoVerificationOptions} verificationOptions
 * @property {CdoSummary} cdoSummary
 */

/**
 * @param indexNumber
 * @param user
 * @return {Promise<unknown>}
 */
const getManageCdoDetails = async (indexNumber, user) => {
  return get(`${cdoEndpoint}/${indexNumber}/manage`, user)
}

module.exports = {
  getCdo,
  getCdoFromActivities,
  getManageCdoDetails
}
