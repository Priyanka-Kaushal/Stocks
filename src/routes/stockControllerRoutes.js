const express = require("express");
const router = express.Router();
const {
  createStock, getAllStock,individualStock,  updateStock, deleteStock
} = require("../controllers/stockController");

router.post("/create_stock", createStock);
router.get("/all_stock", getAllStock);
router.get("/getStock/:id", individualStock);
router.put("/update/:id",updateStock);
router.delete("/delete/:id", deleteStock);

module.exports = router;