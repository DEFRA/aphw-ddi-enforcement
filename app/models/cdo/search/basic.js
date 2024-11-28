const { forms } = require('../../../constants/forms')
const { buildPagination, buildRecordRangeText, buildTitle } = require('../../builders/pagination')
const { errorPusherDefault } = require('../../../lib/error-helpers')

const marginBottom2 = 'govuk-!-margin-bottom-2'

function ViewModel (searchCriteria, results, url, policeForceName, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    searchTerms: {
      label: {
        text: 'Search',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      id: 'searchTerms',
      name: 'searchTerms',
      formGroup: {
        classes: marginBottom2
      },
      value: searchCriteria?.searchTerms,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '100' }
    },
    fuzzy: {
      id: 'fuzzy',
      name: 'fuzzy',
      items: [
        {
          value: 'Y',
          text: 'Include close matches',
          checked: searchCriteria?.fuzzy
        }
      ],
      classes: 'govuk-checkboxes--small',
      formGroup: {
        classes: marginBottom2
      }
    },
    national: {
      id: 'national',
      name: 'national',
      classes: 'govuk-radios--small',
      formGroup: {
        classes: marginBottom2
      },
      value: searchCriteria?.national ?? 'false',
      items: [
        {
          value: 'false',
          text: policeForceName ?? 'Local police force'
        },
        {
          value: 'true',
          text: 'National records'
        }
      ]
    },
    searchType: searchCriteria?.searchType,
    results: {
      items: results?.results?.map(resultObj => ({
        ...resultObj,
        dogNameNotEntered: !resultObj.dogName?.length,
        microchipNumberNotEntered: !resultObj.microchipNumber?.length
      })) || []
    },
    totalFound: results?.totalFound,
    pagination: buildPagination(results, url),
    recordRangeText: buildRecordRangeText(results?.page, results?.totalFound),
    title: buildTitle(results),
    currentPage: results?.page,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
