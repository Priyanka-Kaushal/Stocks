import express from 'express';
import { addStockUnit, getAllStockUnits, getStockUnitById, updateStockUnit, deleteStockUnit} from '../controllers/stock_unit.js';

const router = express.Router();

router.post('/', addStockUnit);

router.get('/', getAllStockUnits);
router.get('/:id', getStockUnitById);
router.patch('/:id', updateStockUnit);
router.delete('/:id', deleteStockUnit);

export default router;
