const Joi = require('joi')
const { getDateComponents, validateDate } = require('../../../lib/date-helpers')

const dogDiedSchema = Joi.object({
  dateOfDeath: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, true, true, false, true)).optional()
    .messages({ 'any.required': 'Enter a Date of death' })
}).required()

const validatePayload = (payload) => {
  payload.dateOfDeath = getDateComponents(payload, 'dateOfDeath')

  const schema = Joi.object({
    'dateOfDeath-year': Joi.number().allow(null).allow(''),
    'dateOfDeath-month': Joi.number().allow(null).allow(''),
    'dateOfDeath-day': Joi.number().allow(null).allow('')
  }).concat(dogDiedSchema)

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
