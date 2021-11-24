const express = require("express");
// const auth = require("../middlewares/auth");

const {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationByType,
} = require("../controllers/locationControllers");

const router = express.Router();

router.get("/", getLocations);
router.get("/:idLocation", getLocationById);
router.get("/type/:type", getLocationByType);
router.post("/create", createLocation);
router.put("/:idLocation", updateLocation);
router.delete("/:idLocation", deleteLocation);

module.exports = router;
