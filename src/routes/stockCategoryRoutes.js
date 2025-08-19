import express from "express";
const router  = express.Router();

import { add_stock_category,  get_stock_category,fetch_stock_category, update_stock_category, delete_stock_category} from '../controllers/stockCategory.js';


router.post(`/add_stock_category`, add_stock_category);
router.get(`/get_all_stock_category`, get_stock_category);
router.get(`/stock_category/:id`,fetch_stock_category);
router.patch(`/stock_category_update/:id`, update_stock_category);
router.delete(`/stock_category_delete/:id`, delete_stock_category);
export default router;