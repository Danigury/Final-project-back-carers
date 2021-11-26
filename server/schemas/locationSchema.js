const { Joi } = require("express-validation");

const LocationValidate = {
  body: Joi.object({
    name: Joi.string()
      .regex(/.{1,50}/)
      .required(),
    woman: Joi.boolean().required,
    type: Joi.string().required,
    address: Joi.object().required,
    phonenumber: Joi.string().required,
    capacity: Joi.number().required,
    timetable: Joi.object().required,
  }),
};

module.exports = { LocationValidate };
