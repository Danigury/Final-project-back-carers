const debug = require("debug")("carers:controller");
const chalk = require("chalk");
const Location = require("../../database/models/location");

const getLocations = async (req, res) => {
  debug(chalk.bgYellow("Loading locations"));
  const locations = await Location.find();
  res.json(locations);
};

const getLocationById = async (req, res, next) => {
  const { idLocation } = req.params;
  try {
    const searchedLocation = await Location.findById(idLocation);
    if (searchedLocation) {
      res.json(searchedLocation);
    } else {
      const error = new Error("Location not found");
      error.code = 401;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Bad request";
    next(error);
  }
};

const getLocationByType = async (req, res, next) => {
  const { typeLocation } = req.params;
  try {
    const searchedLocation = await Location.findOne(typeLocation);
    if (searchedLocation) {
      res.json(searchedLocation);
    } else {
      const error = new Error("Location not found");
      error.code = 401;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Bad request";
    next(error);
  }
};

const createLocation = async (req, res, next) => {
  try {
    debug(chalk.greenBright("Posting location"));
    const newLocation = await Location.create(req.body);
    res.json(newLocation);
  } catch (error) {
    debug(chalk.bgRed("Post failed"));
    error.message = "Post failed";
    error.code = 400;
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    debug(chalk.bgBlueBright("Putting location"));
    const { _id } = req.body;
    const newLocation = await Location.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json(newLocation);
  } catch (error) {
    debug(chalk.bgRed("Put failed"));
    error.message = "Put failed";
    error.code = 400;
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  const { idLocation } = req.params;
  try {
    const searchedLocation = await Location.findByIdAndDelete(idLocation);
    if (searchedLocation) {
      res.json({ id: searchedLocation.id });
    } else {
      const error = new Error("Location not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Bad request";
    next(error);
  }
};

const isAuthorized = (req, res, next) => {
  const { token } = req.query;
  if (token === process.env.TOKEN) {
    next();
  } else {
    debug(chalk.bgRed("Unauthorised"));
  }
};

module.exports = {
  getLocations,
  getLocationById,
  getLocationByType,
  createLocation,
  updateLocation,
  deleteLocation,
  isAuthorized,
};
