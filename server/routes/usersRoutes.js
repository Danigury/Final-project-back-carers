const express = require("express");
const { validate } = require("express-validation");
const { userLogin, userSignUp } = require("../controllers/userControllers");
const loginRequestSchema = require("../schemas/userSchemas");

const router = express.Router();

router.post("/login", validate(loginRequestSchema), userLogin);
router.post("/register", userSignUp);

module.exports = router;
