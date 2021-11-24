require("dotenv").config();
const debug = require("debug")("carers:controller");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
require("../../database/models/location");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    debug(chalk.bgRed("Wrong credentials"));
    const error = new Error("Wrong credentials");
    error.code = 401;
    next(error);
  } else {
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      debug(chalk.bgRed("Wrong credentials"));
      const error = new Error("Wrong credentials");
      error.code = 401;
      next(error);
    } else {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        process.env.SECRET,
        {
          expiresIn: 48 * 60 * 60,
        }
      );
      res.json({ token });
    }
  }
};

const userSignUp = async (req, res, next) => {
  const newUser = req.body;
  const user = await User.findOne({ username: newUser.username });
  if (user) {
    debug(chalk.bgMagenta("Username already exists"));
    const error = new Error("Username already exists");
    error.code = 400;
    next(error);
  } else {
    newUser.password = await bcrypt.hash(newUser.password, 10);
    User.create(newUser);
    res.json().status(200);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const searchedUser = await User.findById(id).populate({
      path: "agenda",
    });
    if (searchedUser) {
      res.json(searchedUser);
    } else {
      const error = new Error("User not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Bad Request";
    next(error);
  }
};

module.exports = { userLogin, userSignUp, getUserById };
