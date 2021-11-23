const chalk = require("chalk");
const mongoose = require("mongoose");
const debug = require("debug")("carers:database");

const connectDB = (database) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret.__v;
      },
    });

    mongoose.connection
      .on("open", () => {
        debug(chalk.bgGreen("Database connection open"));
      })
      .on("close", () => {
        debug(chalk.bgGreen("Database connection close"));
      });

    mongoose.connect(database, (error) => {
      if (error) {
        debug("Cannot connect with Database");
        debug(error.message);
        reject();
        return;
      }
      debug("Connection to Database done");
      resolve();
    });
  });

module.exports = { connectDB };
