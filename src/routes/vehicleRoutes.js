const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerUploadImage");

const {
  createVehicle,
  getAllVehicles,
  retrieveVehicle,
  updateVehicle,
  deleteVehicleInfo,
} = require("../controllers/vehicleController");

router.post("/createVehicle", upload.single("image"), createVehicle);
router.get("/allVehicles", getAllVehicles);
router.get("/retrieveVehicle/:id", retrieveVehicle);
router.put("/updateVehicle/:id", upload.single("image"), updateVehicle);
router.delete("/deleteVehicle/:id", deleteVehicleInfo);

module.exports = router;

