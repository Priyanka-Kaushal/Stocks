import express from 'express';
import upload from '../middlewares/multerUploadImage.js';


import {
  rawMaterialStock,
  allRawMaterialStock,
  individualRawmaterial,
  updateRawMaterial,
  deleteRawmaterial,
} from '../controllers/rawMaterialStockController.js';

const router = express.Router();

router.post('/createRawMaterial', (req, res, next) => {
  console.log("Before multer");
  next();
}, upload.single('image'), (req, res, next) => {
  console.log("After multer, req.file:", req.file);
  next();
}, rawMaterialStock);

router.get('/all_raw_material', allRawMaterialStock);
router.get('/individualRawmaterial/:id', individualRawmaterial);
router.put('/update/:id', upload.single('image'), updateRawMaterial);
router.delete('/delete/:id', deleteRawmaterial);

export default router;

