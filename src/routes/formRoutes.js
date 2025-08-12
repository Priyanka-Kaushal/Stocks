// src/routes/formRoutes.js
import express from "express";
import { createRequirementForm, getAllRequirements } from "../controllers/formRequirementController.js";
import upload from "../middlewares/multerUploadImage.js";

const router = express.Router();

router.post(
  "/formDetails",
  upload.fields([
    { name: "quantityPhoto", maxCount: 1 },
    { name: "vehicleRegPhoto", maxCount: 1 },
    { name: "moistureImage", maxCount: 1 },
    { name: "ashContentImage", maxCount: 1 },
    { name: "gcvImage", maxCount: 1 },
    { name: "rawMaterialTypeImage", maxCount: 1 },
    { name: "vehicleTypeImage", maxCount: 1 },
  ]),
  createRequirementForm
);

router.get("/getdetails", getAllRequirements);

export default router;
