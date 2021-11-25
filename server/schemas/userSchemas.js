const { Joi } = require("express-validation");

const loginRequestSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const userSignUpRequestSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = { loginRequestSchema, userSignUpRequestSchema };
