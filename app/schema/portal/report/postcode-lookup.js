const Joi = require('joi')
const { validatePayloadBuilder } = require('../../validate')

const postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i

const postcodeValidation = Joi.string().trim().required().max(8).regex(postcodeRegex).messages({
  'any.required': 'Enter a postcode',
  'string.empty': 'Enter a postcode',
  'string.max': 'Postcode must be no more than {#limit} characters',
  'string.pattern.base': 'Postcode must be a real postcode'
})

const houseNumberValidation = Joi.string().trim().optional().allow('').allow(null).max(24).messages({
  'string.max': 'Property name or number must be no more than {#limit} characters'
})

const schema = Joi.object({
  postcode: postcodeValidation,
  houseNumber: houseNumberValidation,
  submitButton: Joi.string().allow(null).allow('').optional()
}).required()

const validatePayload = validatePayloadBuilder(schema)

module.exports = {
  validatePayload
}
