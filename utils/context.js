const response = require('./response')
const Joi = require('joi')

/**
 *
 * @param {Object} params - 需要被验证的 key-value
 * @param {Object} schema - 验证规则
 * @return Promise
 */
function validate(params = {}, schema = {}) {
  const ctx = this
  const validator = Joi.validate(params, Joi.object().keys(schema), { allowUnknown: true })
  if (validator.error) {
    // ctx.client(403, validator.error.message)zz
    ctx.throw(400, validator.error.message)
    return false
  }
  return true
}

module.exports = {
  answer: response,
  validate: validate
}
