const { buildReportSubTitle } = require('../../../lib/model-helpers')

function ViewModel (payload) {
  this.model = {
    sourceType: payload?.sourceType,
    pk: payload?.pk,
    dogIndexOverride: payload?.dogChosen?.indexNumber,
    subTitle: buildReportSubTitle(payload)
  }
}

module.exports = ViewModel
