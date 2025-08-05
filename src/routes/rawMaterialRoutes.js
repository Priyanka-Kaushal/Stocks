const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerUploadImage");
const {
rawMaterialStock, allRawMaterialStock, updateRawMaterial, deleteRawmaterial 
} = require("../controllers/rawMaterialStockController");


// updateRawMaterialStock, deleteRawMaterialStock

console.log(" rawMaterialStock controller loaded");


router.post("/createRawMaterial", upload.single("image"), rawMaterialStock);
router.get("/all_raw_material", allRawMaterialStock);
router.put("/update/:id", upload.single("image"), updateRawMaterial);
router.delete("/delete/:id", deleteRawmaterial);

module.exports = router;