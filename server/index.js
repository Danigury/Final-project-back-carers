const chalk = require("chalk");
const debug = require("debug")("carers:server");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(cors);

const initializeServer = (port) =>
  new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug(chalk.bgGreen(`Connecting to ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.bgRed("Error to initialize server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.bgRed(`Port ${port} is already in use.`));
      }

      debug(chalk.bgRed(error.code));
    });

    server.on("close", () => {
      debug(chalk.bgBlueBright("See u next Time!"));
    });
  });

app.use(morgan("dev"));
app.use(express.json());

module.exports = { initializeServer, app };
