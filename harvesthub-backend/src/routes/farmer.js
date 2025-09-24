import express from 'express';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';  // must check farmer role
console.log('auth typeof:', typeof auth, 'auth default is function?', typeof auth === 'function');

console.log('farmer.js loaded — typeof auth:', typeof auth, 'auth:', auth);
try {
  const maybeMw = auth && auth(['farmer']);
  console.log('called auth(["farmer"]) => typeof:', typeof maybeMw, Object.prototype.toString.call(maybeMw));
} catch (err) {
  console.error('calling auth([...]) threw:', err);
}

const router = express.Router();

// Create a new crop
router.post('/crops', auth(['farmer']), async (req, res) => {
  try {
    const crop = await Crop.create({
      farmerId: req.user.id,
      ...req.body,
    });
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all crops by this farmer
router.get('/crops', auth(['farmer']), async (req, res) => {
  const crops = await Crop.find({ farmerId: req.user.id });
  res.json(crops);
});

// Update a crop
router.put('/crops/:id', auth(['farmer']), async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a crop
router.delete('/crops/:id', auth(['farmer']), async (req, res) => {
  await Crop.findOneAndDelete({ _id: req.params.id, farmerId: req.user.id });
  res.json({ message: 'Crop deleted' });
});

// View orders for this farmer
router.get('/orders', auth(['farmer']), async (req, res) => {
  const orders = await Order.find({ farmerId: req.user.id })
    .populate('retailerId', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

//Update order status
router.patch('/orders/:id/status', auth(['farmer']), async (req, res) => {
  const { status } = req.body; // must be one of the enum values
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
