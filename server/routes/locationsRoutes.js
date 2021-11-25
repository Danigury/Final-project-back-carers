const express = require("express");
const auth = require("../middlewares/auth");

const {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationByType,
} = require("../controllers/locationControllers");

const router = express.Router();

router.get("/", auth, getLocations);
router.get("/:idLocation", auth, getLocationById);
router.get("/type/:type", auth, getLocationByType);
router.post("/create", auth, createLocation);
router.put("/:idLocation", auth, updateLocation);
router.delete("/:idLocation", auth, deleteLocation);

module.exports = router;
