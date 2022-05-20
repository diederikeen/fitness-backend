const Joi = require('joi');

const weightTrackerValidation = (data) => {
  const weightTrackerSchema = Joi.object({
    weight: Joi.number().required(),
    date: Joi.date().required(),
  });

  return weightTrackerSchema.validate(data);
};

module.exports = weightTrackerValidation;
