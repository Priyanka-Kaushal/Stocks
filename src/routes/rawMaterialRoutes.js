import express from "express";
import upload from "../middlewares/multerUploadImage.js";

import {
  createRawMaterial,
  getAllRawMaterials,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
} from "../controllers/rawMaterialStockController.js";

const router = express.Router();

router.post(
  "/createRawMaterial",
  (req, res, next) => {
    console.log("Before multer");
    next();
  },
  upload.single("image"),
  (req, res, next) => {
    console.log("After multer, req.file:", req.file);
    next();
  },
  createRawMaterial
);

router.get("/all_raw_material", getAllRawMaterials);
router.get("/individualRawmaterial/:id", getRawMaterialById);
router.put("/update/:id", upload.single("image"), updateRawMaterial);
router.delete("/delete/:id", deleteRawMaterial);

export default router;
