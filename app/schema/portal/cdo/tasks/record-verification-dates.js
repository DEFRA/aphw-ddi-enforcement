const Joi = require('joi')
const { getDateComponents } = require('../../../../lib/date-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')
const { validateMicrochipNumber, validateMicrochipVerification, validateNeuteringConfirmation } = require('../../../../lib/validation-helpers')

const verificationDatesSchema = Joi.object({
  microchipNumber: Joi.any().custom((value, helper) => validateMicrochipNumber(value, helper)),
  taskName: Joi.string().required(),
  dogNotFitForMicrochip: Joi.boolean().truthy('Y').default(false),
  dogNotNeutered: Joi.boolean().truthy('Y').default(false),
  microchipVerification: Joi.any().custom((value, helper) => validateMicrochipVerification(value, helper)),
  neuteringConfirmation: Joi.any().custom((value, helper) => validateNeuteringConfirmation(value, helper))
})

const baseSchema = Joi.object({
  'microchipVerification-year': Joi.number().allow(null).allow(''),
  'microchipVerification-month': Joi.number().allow(null).allow(''),
  'microchipVerification-day': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-year': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-month': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-day': Joi.number().allow(null).allow('')
})

const validateVerificationDates = (payload) => {
  payload.microchipVerification = getDateComponents(payload, 'microchipVerification')
  payload.neuteringConfirmation = getDateComponents(payload, 'neuteringConfirmation')

  const schema = baseSchema.concat(verificationDatesSchema)

  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateVerificationDates,
  verificationDatesSchema
}
