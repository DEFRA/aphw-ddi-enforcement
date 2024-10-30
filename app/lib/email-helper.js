const { reportTypes } = require('../constants/cdo/report')
const { formatToDDMMYYYY } = require('../lib/date-helpers')

const addressIndent = '    '

const buildInBreach = data => {
  let details
  if (data.sourceType === 'dog') {
    details = `Breach reported for Dog ${data?.pk}\n`
  } else {
    details = `Breach reported for Dog ${data?.dogChosen?.indexNumber}\n`
  }
  details += 'Reasons:\n'
  details += data?.dogBreaches?.map(breach => ` - ${breach}\n`).join('')
  return details
}

const buildChangedAddress = data => {
  let details
  if (data.sourceType === 'dog') {
    details = `Change of address reported for Dog ${data?.pk}\n`
  } else {
    const ownsDogs = data?.dogs?.length > 1 ? `(owns dogs ${data.dogs.join(', ')})` : `(owns dog ${data.dogs[0]})`
    details = `Change of address reported for ${data?.firstName} ${data?.lastName} ${ownsDogs}\n`
  }
  details += 'New address:\n'
  details += data.addressLine1 ? `${addressIndent}${data.addressLine1}\n` : ''
  details += data.addressLine2 ? `${addressIndent}${data.addressLine2}\n` : ''
  details += data.town ? `${addressIndent}${data.town}\n` : ''
  details += data.postcode ? `${addressIndent}${data.postcode}\n` : ''
  details += data.country ? `${addressIndent}${data.country}\n` : ''
  return details
}

const buildDogDied = data => {
  let details
  if (data.sourceType === 'dog') {
    details = `Dog ${data?.pk} has died\n`
  } else {
    details = `Dog ${data?.dogChosen?.indexNumber} has died\n`
  }
  details += `Date of death: ${formatToDDMMYYYY(data?.dateOfDeath)}\n`
  return details
}

const buildSomethingElse = data => {
  let details
  if (data.sourceType === 'dog') {
    details = `Something else for Dog ${data?.pk}\n`
  } else {
    const ownsDogs = data?.dogs?.length > 1 ? `(owns dogs ${data.dogs.join(', ')})` : `(owns dog ${data.dogs[0]})`
    details = `Something else for ${data?.firstName} ${data?.lastName} ${ownsDogs}\n`
  }
  details += `Details: ${data?.details}\n`
  return details
}

/**
 * @param data
 * @param {{
*    username: string;
*    accessToken: string;
*    displayname: string;
* }} user
*/
const buildReportSomethingPayload = (data, user) => {
  let details
  if (data.reportType === reportTypes.inBreach) {
    details = buildInBreach(data)
  } else if (data.reportType === reportTypes.changedAddress) {
    details = buildChangedAddress(data)
  } else if (data.reportType === reportTypes.dogDied) {
    details = buildDogDied(data)
  } else {
    details = buildSomethingElse(data)
  }
  const outData = {
    fields: [
      { name: 'Details', value: details },
      { name: 'ReportedBy', value: user?.username }
    ],
    reportData: data
  }
  return outData
}

module.exports = {
  buildReportSomethingPayload
}
