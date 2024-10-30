const Joi = require('joi')
const { validatePayloadBuilder } = require('../../validate')

const schema = Joi.object({
  reportType: Joi.string().required()
    .messages({
      '*': 'Select an option'
    }),
  pk: Joi.string().required(),
  sourceType: Joi.string().valid('dog', 'owner').required(),
  subTitle: Joi.string().optional().allow(null).allow('')
}).required()

const validatePayload = validatePayloadBuilder(schema)

module.exports = {
  validatePayload
}
