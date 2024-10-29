const Joi = require('joi')
const { forms } = require('../../../constants/forms')

const schema = Joi.object({
  details: Joi.string().required().max(forms.maxTextAreaLength).messages({
    'any.required': 'Enter the details of your report',
    'string.empty': 'Enter the details of your report',
    'string.max': 'Enter less than 1200 characters'
  })
}).required()

const validatePayload = (payload) => {
  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
