const Joi = require('joi')

const cdoTasksGetSchema = Joi.object({
  dogIndex: Joi.string().required(),
  taskName: Joi.string().valid('submit-form-two').required()
})

module.exports = {
  cdoTasksGetSchema
}
