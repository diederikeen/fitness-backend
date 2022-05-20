const Joi = require('joi');

const loginValidation = (data) => {
  const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required(),
  });

  return loginSchema.validate(data);
};

module.exports = loginValidation;
