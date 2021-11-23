const chalk = require("chalk");
const { ValidationError } = require("express-validation");

const debug = require("debug")("carers:server:error");

const notFoundHandler = (req, res) => {
  res.status(404).json({ error: "Page not found" });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Validation error";
  }
  debug(chalk.bgRed("An error has ocurred: "), chalk.bgRed(error.message));
  const message = error.code ? error.message : "General error!";
  res.status(error.code || 500).json({ error: message });
};

module.exports = { notFoundHandler, errorHandler };
