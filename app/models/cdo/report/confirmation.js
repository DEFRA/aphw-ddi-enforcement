const { buildReportSubTitle } = require('../../../lib/model-helpers')

function ViewModel (payload) {
  this.model = {
    sourceType: payload?.sourceType,
    pk: payload?.pk,
    dogIndexOverride: payload?.dogChosen?.indexNumber,
    subTitle: buildReportSubTitle(payload),
    numberOfDogs: payload?.dogs?.length ?? 1
  }
}

module.exports = ViewModel
