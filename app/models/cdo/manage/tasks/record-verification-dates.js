const { errorPusherWithDate } = require('../../../../lib/error-helpers')
const { constructDateField } = require('../../../../lib/model-helpers')
const { routes } = require('../../../../constants/cdo/dog')

/**
 * @param labelText
 * @return {GovukFieldset}
 */
const constructFieldset = labelText => {
  return {
    legend: {
      text: labelText,
      classes: 'govuk-fieldset__legend--s'
    },
    classes: 'govuk-!-margin-bottom-7',
    role: 'group'
  }
}

/**
 * @type {GovukFieldset}
 */
const verificationFieldset = {
  legend: {
    isPageHeading: true,
    text: 'Confirm microchip and neutering details',
    classes: 'govuk-fieldset__legend--l govuk-!-margin-bottom-5'
  }
}

/**
 * @param {CdoTaskListDto & {indexNumber: string }} data
 * @param backNav
 * @param errors
 * @constructor
 */
function ViewModel (data, backNav, errors) {
  /**
   * @type {GovukCheckBox|false}
   */
  const dogNotFitForMicrochip = {
    name: 'dogNotFitForMicrochip',
    items: [
      {
        text: 'Dog declared unfit for microchipping by vet',
        checked: data.verificationOptions.dogDeclaredUnfit
      }
    ],
    formGroup: {
      beforeInputs: {
        html: '<div class="govuk-body govuk-!-margin-top-2 govuk-!-margin-bottom-0">or</div>'
      }
    },
    classes: 'govuk-checkboxes--small govuk-!-margin-top-0'
  }

  /**
   * @type {GovukCheckBox|false}
   */
  const dogNotNeutered = {
    name: 'dogNotNeutered',
    items: [
      {
        text: 'Dog aged under 16 months and not neutered',
        checked: data.verificationOptions.neuteringBypassedUnder16
      }
    ],
    classes: 'govuk-checkboxes--small govuk-!-margin-top-0',
    formGroup: {
      beforeInputs: {
        html: '<div class="govuk-body govuk-!-margin-top-2 govuk-!-margin-bottom-0">or</div>'
      }
    }
  }

  /**
   * @type {GovukInput}
   */
  const microchipNumber = {
    label: {
      text: 'Microchip number',
      classes: 'govuk-label--s'
    },
    value: data.microchipNumber,
    classes: 'govuk-input--width-10 govuk-!-margin-bottom-3',
    name: 'microchipNumber',
    id: 'microchipNumber'
  }

  this.model = {
    backLink: backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    microchipFieldGroup: constructFieldset('When was the dog\'s microchip number verified?'),
    neuteringFieldGroup: constructFieldset('When was the dog\'s neutering verified?'),
    dogNotNeutered,
    dogNotFitForMicrochip,
    microchipNumber,
    microchipVerification: constructDateField(data, 'microchipVerification', 'When was the dog\'s microchip number verified?', null, 'govuk-fieldset__legend--s', { hideMargin: true, hideFieldset: true, date: { formGroup: { classes: 'govuk-!-margin-bottom-0' } } }),
    neuteringConfirmation: constructDateField(data, 'neuteringConfirmation', 'When was the dog\'s neutering verified?', null, 'govuk-fieldset__legend--s', { hideMargin: true, hideFieldset: true, date: { formGroup: { classes: 'govuk-!-margin-bottom-0' } } }),
    errors: [],
    verificationFieldset,
    neuteringGroupClass: '',
    microchipGroupClass: ''
  }

  errorPusherWithDate(errors, this.model)

  if (this.model.errors.some(error => error.href.includes('microchipVerification'))) {
    this.model.microchipGroupClass = 'govuk-form-group--error'
  }

  if (this.model.errors.some(error => error.href.includes('neuteringConfirmation'))) {
    this.model.neuteringGroupClass = 'govuk-form-group--error'
  }
}

module.exports = ViewModel
