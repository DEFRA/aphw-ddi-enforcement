const { routes } = require('../../../constants/cdo/report')
const { dedupeAddresses, buildReportSubTitle } = require('../../../lib/model-helpers')

function ViewModel (details, addresses = [], error) {
  const items = addresses
    ? addresses.map((address, index) => ({
        text: `${address.addressLine1}, ${address.town}, ${address.postcode}`,
        value: index
      }))
    : []

  this.model = {
    backLink: details?.backLink,
    changePostcodeLink: `${details?.backLink}#postcode`,
    addressRoute: `${routes.address.get}${details.srcHashParam}`,
    buttonText: 'Select address',
    subTitle: buildReportSubTitle(details),
    source: details?.source,
    postcode: details?.postcode,
    results: {
      id: 'address',
      name: 'address',
      items: dedupeAddresses(items),
      classes: 'govuk-radios--small'
    }
  }

  if (error) {
    this.model.results.errorMessage = {
      text: error.details[0].message
    }
  }
}

module.exports = ViewModel
