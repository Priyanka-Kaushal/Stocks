// import express from "express";
// import {
//   createStock,
//   createStockSupabase,
//   getAllStock,
//   individualStock,
//   updateStock,
//   deleteStock,
// } from "../controllers/stockController.js";

// const router = express.Router();

// router.post("/add-stock", createStock);

// router.post("/add-stock-supa", createStocksupabase);


// // router.get("/stock-list", getAllStock);

// // router.get("/:id", individualStock);

// // router.put("/stock/:id", updateStock);

// // router.delete("/:id", deleteStock);
import express from "express";
import {
  createStock,
  createStockSupabase,
  getAllStock,
  individualStock,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";

const router = express.Router();

router.post("/add-stock", createStock);

router.post("/add-stock-supa", createStockSupabase);

router.get("/stock-list", getAllStock);

router.get("/:id", individualStock);

router.put("/stock/:id", updateStock);

router.delete("/:id", deleteStock);

export default router;
