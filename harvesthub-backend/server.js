import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';
import farmerRoutes from './src/routes/farmer.js';
import retailerRoutes from './src/routes/retailer.js';
import paymentsRoutes from './src/routes/payments.js';
import fssaiRoutes from './src/routes/fssai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// API routes
app.use('/api/farmer', farmerRoutes);
app.use('/api/retailer', retailerRoutes);
app.use('/api/payment', paymentsRoutes);
app.use('/api/fssai', fssaiRoutes);

// Serve frontend static files (harvesthub-frontend at repo root)
const frontendPath = path.join(__dirname, '../harvesthub-frontend');
app.use(express.static(frontendPath));

// If request is not for API, serve frontend entry (harvesthub.html)
app.get('/*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).send('API route not found');
  res.sendFile(path.join(frontendPath, 'harvesthub.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));