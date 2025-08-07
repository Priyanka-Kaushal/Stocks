
const express = require("express");
const router = express.Router();
const { createRequirementForm, getAllRequirements } = require("../controllers/formRequirementController");
const upload = require("../middlewares/multerUploadImage");


router.post(
  "/formDetails",
  upload.fields([
    { name: "quantityPhoto", maxCount: 1 },
    { name: "vehicleRegPhoto", maxCount: 1 },
    { name: "moistureImage", maxCount: 1 },
    { name: "ashContentImage", maxCount: 1 },
    { name: "gcvImage", maxCount: 1 },
    {name: "rawMaterialTypeImage", maxCount: 1},
    { name: "vehicleTypeImage", maxCount: 1 },
  ]),
  createRequirementForm
);

router.get("/getdetails", getAllRequirements);

module.exports = router;
