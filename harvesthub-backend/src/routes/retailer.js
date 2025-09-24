import express from 'express';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Browse or search crops
// Example: GET /api/retailer/crops?name=wheat
router.get('/crops', async (req, res) => {
  const filter = {};
  if (req.query.name) {
    filter.$text = { $search: req.query.name };
  }
  const crops = await Crop.find(filter).populate('farmerId', 'name email');
  res.json(crops);
});

// Create an order
router.post('/orders', auth(['retailer']), async (req, res) => {
  try {
    const { farmerId, items } = req.body;

    // Calculate total
    let total = 0;
    for (const item of items) {
      const crop = await Crop.findById(item.cropId);
      if (!crop) throw new Error('Invalid crop');
      total += crop.price * item.qty;
      item.name = crop.name;   // snapshot crop name
      item.price = crop.price; // snapshot price
    }

    const upfront = Math.round(total * 0.2);

    const order = await Order.create({
      retailerId: req.user.id,
      farmerId,
      items,
      totalAmount: total,
      upfrontAmount: upfront
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//View retailer's own orders
router.get('/orders', auth(['retailer']), async (req, res) => {
  const orders = await Order.find({ retailerId: req.user.id })
    .populate('farmerId', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
