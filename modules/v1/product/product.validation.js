const Joi = require('joi');
const request_validation = require('../../utils/request_validation');

class productValidation {
  static list(req) {
    const schema = Joi.object({
      page: Joi.number(),
      limit: Joi.number(),
      keyword: Joi.string(),
      category_id: Joi.number(),
    });

    return request_validation(schema, req);
  }

  static detail(req) {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    return request_validation(schema, req);
  }
}

module.exports = productValidation;
