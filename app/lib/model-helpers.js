const { reportTypes } = require('../constants/cdo/report')

const extractEmail = (contacts) => {
  if (!contacts || contacts.length === 0) {
    return ''
  }
  const email = contacts.filter(x => x.contact.contact_type.contact_type === 'Email').sort(propertyComparatorDesc('contact', 'id')).map(y => y.contact.contact)
  return email.length > 0 ? email[0] : null
}

const extractLatestPrimaryTelephoneNumber = (contacts) => {
  if (contacts && contacts.length > 0) {
    const primaryPhones = contacts.filter(x => x.contact.contact_type.contact_type === 'Phone').sort(propertyComparatorDesc('contact', 'id')).map(y => y.contact.contact)
    if (primaryPhones.length > 0) {
      return primaryPhones[0]
    }
  }
  return null
}

const extractLatestSecondaryTelephoneNumber = (contacts) => {
  if (contacts && contacts.length > 0) {
    const secondaryPhones = contacts.filter(x => x.contact.contact_type.contact_type === 'SecondaryPhone').sort(propertyComparatorDesc('contact', 'id')).map(y => y.contact.contact)
    if (secondaryPhones.length > 0) {
      return secondaryPhones[0]
    }
  }
  return null
}

const extractLatestAddress = (addresses) => {
  if (addresses == null || addresses.length === 0) {
    return {}
  }
  const latestAddress = addresses.sort(propertyComparatorDesc('address', 'id'))[0].address
  return {
    addressLine1: latestAddress.address_line_1,
    addressLine2: latestAddress.address_line_2,
    town: latestAddress.town,
    postcode: latestAddress.postcode,
    country: latestAddress.country?.country
  }
}

const formatAddressAsArray = address => {
  return [].concat(address.addressLine1, address.addressLine2, address.town, address.postcode).filter(el => el != null && el !== '')
}

const extractLatestInsurance = (insurances) => {
  if (insurances == null || insurances.length === 0) {
    return {}
  }
  return insurances.sort(propertyComparatorDesc('id'))[0]
}

const propertyComparatorDesc = (propertyName, childPropertyName) => {
  return function (a, b) {
    return childPropertyName ? b[propertyName][childPropertyName] - a[propertyName][childPropertyName] : b[propertyName] - a[propertyName]
  }
}

const cleanUserDisplayName = (displayName) => {
  if (displayName.includes(',')) {
    const [lastName, firstName] = displayName.split(',')

    return `${firstName.trim()} ${lastName.trim()}`
  }
  return displayName
}

const dedupeAddresses = items => {
  const uniqueAddressMap = new Map()

  if (items) {
    items.forEach(addr => {
      uniqueAddressMap.set(addr.text, addr)
    })
  }

  return [...uniqueAddressMap].map(([_, value]) => value)
}

const constructDateField = (data, id, labelText, hint = null, labelClass = null, options = {}) => {
  const fieldset = options.hideFieldset
    ? {}
    : {
        fieldset: {
          ...options.fieldset,
          legend: {
            text: labelText,
            classes: labelClass || labelClass === '' ? labelClass : 'govuk-fieldset__legend--s',
            ...options.fieldset?.legend
          }
        }
      }

  const fieldMetadata = {
    type: 'date',
    id: id,
    namePrefix: id,
    ...fieldset,
    items: [
      {
        name: 'day',
        classes: 'govuk-input--width-2',
        value: data[`${id}-day`],
        attributes: { maxlength: '2' }
      },
      {
        name: 'month',
        classes: 'govuk-input--width-2',
        value: data[`${id}-month`],
        attributes: { maxlength: '2' }
      },
      {
        name: 'year',
        classes: 'govuk-input--width-4',
        value: data[`${id}-year`],
        attributes: { maxlength: '4' }
      }
    ],
    classes: options.hideMargin ? '' : 'govuk-!-margin-bottom-5',
    ...options.date
  }

  if (hint) {
    fieldMetadata.hint = {
      text: hint
    }
  }

  return fieldMetadata
}

const buildReportSubTitle = (payload, forceOwnerDisplay = false) => {
  if (payload?.sourceType === 'dog') {
    return `Dog ${payload?.pk}`
  }
  if ((payload?.reportType === reportTypes.inBreach || payload?.reportType === reportTypes.dogDied) &&
      payload?.dogChosen?.indexNumber && !forceOwnerDisplay) {
    return `Dog ${payload?.dogChosen?.indexNumber}`
  }
  return `${payload?.firstName} ${payload?.lastName}`
}

const buildReportTitle = (payload) => {
  if (payload?.reportType === reportTypes.inBreach) {
    return 'Which of the owner\'s dogs is in breach?'
  } else {
    return 'Which of the owner\'s dogs has died?'
  }
}

const isMicrochipDeadlineVisibleInView = cdo => {
  return cdo.exemption.exemptionOrder === '2015' || cdo.exemption.exemptionOrder === '2023'
}

const isNeuteringDeadlineVisibleInView = cdo => {
  if (cdo.exemption.exemptionOrder === '2023') {
    return true
  }
  return cdo.exemption.exemptionOrder === '2015' && cdo.dog.breed === 'XL Bully'
}

module.exports = {
  extractEmail,
  extractLatestAddress,
  formatAddressAsArray,
  extractLatestInsurance,
  extractLatestPrimaryTelephoneNumber,
  extractLatestSecondaryTelephoneNumber,
  cleanUserDisplayName,
  dedupeAddresses,
  constructDateField,
  buildReportTitle,
  buildReportSubTitle,
  isMicrochipDeadlineVisibleInView,
  isNeuteringDeadlineVisibleInView
}
