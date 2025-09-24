import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import auth from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create a Razorpay order for 20% upfront
 * Called by the retailer client after placing an order
 */
router.post('/create-order', auth(['retailer']), async (req, res) => {
  try {
    const { orderId } = req.body;
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) return res.status(404).json({ error: 'Order not found' });

    const options = {
      amount: Math.round(dbOrder.upfrontAmount * 100), // Razorpay amount is in paise
      currency: 'INR',
      receipt: `hh_${dbOrder._id}`,
      notes: {
        dbOrderId: dbOrder._id.toString(),
        type: 'Upfront'
      }
    };

    const razorOrder = await razorpay.orders.create(options);

    // Save the razorpay order id so we can verify later if desired
    dbOrder.paymentStatus = 'Partial';
    await dbOrder.save();

    res.json({
      razorpayOrderId: razorOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: razorOrder.currency
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create Razorpay order' });
  }
});

/**
 * Verify payment signature after success
 * Called by the front-end immediately after a successful Razorpay payment
 */
router.post('/verify-payment', auth(['retailer']), async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId
    } = req.body;

    // Step 1: Generate signature on backend
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Step 2: Compare signatures
    if (expectedSignature === razorpay_signature) {
      //Mark upfront payment complete
      await Order.findByIdAndUpdate(dbOrderId, { upfrontPaid: true });
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: 'Signature mismatch' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
