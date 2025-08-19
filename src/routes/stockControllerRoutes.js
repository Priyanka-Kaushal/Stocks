import express from "express";
import {
  createStock,
  getAllStock,
  individualStock,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";

const router = express.Router();

router.post("/add-stock", createStock);

router.get("/stock-list", getAllStock);

router.get("/:id", individualStock);

router.put("/stock/:id", updateStock);

router.delete("/:id", deleteStock);

export default router;
