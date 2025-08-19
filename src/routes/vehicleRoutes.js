import express from 'express';
import upload from '../middlewares/multerUploadImage.js';
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicleInfo,
} from '../controllers/vehicleController.js';

const router = express.Router();

router.post('/createVehicle', upload.single('image'), createVehicle);
router.get('/allVehicles', getAllVehicles);
router.get('/retrieveVehicle/:id', getVehicleById);
router.put('/updateVehicle/:id', upload.single('image'), updateVehicle);

router.delete('/deleteVehicle/:id', deleteVehicleInfo);

export default router;
