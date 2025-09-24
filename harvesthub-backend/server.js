import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';

const app = express();
app.use(cors());
app.use(json());

app.get('/', (req,res)=> res.send('API running'));

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server on ${PORT}`));

const fssaiRoutes = require('./src/routes/fssai');
app.use('/api/fssai', fssaiRoutes);

import paymentRoutes from './src/routes/payment.js';

app.use('/api/payment', paymentRoutes);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import farmerRoutes from './src/routes/farmer.js';
import retailerRoutes from './src/routes/retailer.js';

dotenv.config();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/farmer', farmerRoutes);
app.use('/api/retailer', retailerRoutes);

app.get('/', (req, res) => res.send('API running'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
