import express from 'express';
import rawMaterialRoutes from './src/routes/rawMaterialRoutes.js';
import stockRoutes from './src/routes/stockControllerRoutes.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import formRoutes from './src/routes/formRoutes.js';

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/rawmaterial', rawMaterialRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/requirements', formRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
