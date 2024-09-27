const Joi = require('joi')

const schema = Joi.object({
  code: Joi.string().required().min(6).max(6).messages(
    { '*': 'Please enter a 6 digit code' }
  )
}).required()

const validatePayload = (payload) => {
  console.log('JB payload', payload)
  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
