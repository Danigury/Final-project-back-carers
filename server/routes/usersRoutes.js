const express = require("express");
const { validate } = require("express-validation");
const {
  userLogin,
  userSignUp,
  getMyLocation,
  updateUserAgenda,
} = require("../controllers/userControllers");
const loginRequestSchema = require("../schemas/userSchemas");

const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/login", validate(loginRequestSchema), userLogin);
router.post("/register", userSignUp);
router.get("/agenda", auth, getMyLocation);
router.put("/agenda", auth, updateUserAgenda);

module.exports = router;
