const { routes } = require('../../../constants/cdo/report')
const { errorPusherDefault } = require('../../../lib/error-helpers')

/**
 * @param dog
 * @param {BreachCategory[]} breachCategories
 * @param {string[]} selectedBreachCategories
 * @param backNav
 * @param [errors]
 * @constructor
 */
function ViewModel (details, breachCategories, backNav, errors) {
  /**
   * @type {{
   * dogBreaches: GovukCheckBox,
   * backLink,
   * indexNumber,
   * srcHashParam,
   * errors: *[]}}
   */
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    notListedLink: `${routes.somethingElse.get}${backNav.srcHashParam}`,
    subTitle: `Dog ${details?.dogChosen?.indexNumber || details?.pk}`,
    dogBreaches: {
      items: breachCategories.map(breachCategory => ({
        value: breachCategory.short_name,
        text: breachCategory.label,
        checked: false
      })),
      name: 'dogBreaches',
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true,
          text: 'What is the reason for the breach?'
        }
      },
      hint: {
        text: 'Select all that apply.'
      }
    },
    errors: []
  }
  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
