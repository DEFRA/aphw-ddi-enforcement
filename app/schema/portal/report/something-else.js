const Joi = require('joi')

const schema = Joi.object({
  details: Joi.string().required().max(1200).messages({
    'any.required': 'Enter the details of your report',
    'string.empty': 'Enter the details of your report',
    'string.max': 'Details must be 1200 characters or less'
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
