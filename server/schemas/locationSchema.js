const { Joi } = require("express-validation");

const LocationValidate = {
  body: Joi.object({
    title: Joi.string()
      .regex(/.{1,50}/)
      .required(),
    date: Joi.object().required,
    country: Joi.string().required,
    images: Joi.object().required,
    text: Joi.string()
      .regex(/.{50, 300}/)
      .required(),
    map: Joi.object().required,
    comments: Joi.object(),
  }),
};

module.exports = { LocationValidate };
