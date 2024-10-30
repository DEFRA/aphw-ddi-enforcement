const { reportTypes } = require('../../../constants/cdo/report')
const { errorPusherDefault } = require('../../../lib/error-helpers')
const { buildReportSubTitle } = require('../../../lib/model-helpers')

const standardOptions = [
  {
    value: reportTypes.inBreach,
    text: 'The owner is in breach of their exemption'
  },
  {
    value: reportTypes.changedAddress,
    text: 'The owner has changed address'
  },
  {
    value: reportTypes.dogDied,
    text: 'The dog has died'
  },
  {
    divider: 'or'
  },
  {
    value: reportTypes.somethingElse,
    text: 'Something else'
  }
]

const orphanedOwnerOptions = [
  {
    value: reportTypes.changedAddress,
    text: 'The owner has changed address'
  },
  {
    divider: 'or'
  },
  {
    value: reportTypes.somethingElse,
    text: 'Something else'
  }
]

function ViewModel (payload, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    sourceType: payload?.sourceType,
    pk: payload?.pk,
    subTitle: buildReportSubTitle(payload, true),
    firstName: payload?.firstName,
    lastName: payload?.lastName,
    reportType: {
      id: 'reportType',
      name: 'reportType',
      classes: '',
      formGroup: {
        classes: 'govuk-!-margin-bottom-2'
      },
      value: payload?.reportType,
      items: (payload?.dogs?.length ?? 0) === 0 ? orphanedOwnerOptions : standardOptions
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = {
  ViewModel,
  reportTypes
}
