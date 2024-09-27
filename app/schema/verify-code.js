const Joi = require('joi')
const strLen = 6

const schema = Joi.object({
  code: Joi.string().required().min(strLen).max(strLen).messages(
    { '*': 'Please enter a 6 digit code' }
  )
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
