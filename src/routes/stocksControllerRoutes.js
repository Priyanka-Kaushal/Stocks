import express from 'express';
import { addStock } from '../controllers/addStock.js';

const router = express.Router();

router.post('/add', addStock);

export default router;
