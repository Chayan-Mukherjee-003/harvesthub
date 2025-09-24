import express from "express";
import auth from "../middleware/auth.js";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * Placeholder: Create order route
 * Right now it just marks upfront payment as "Pending"
 */
router.post("/create-order", auth(["retailer"]), async (req, res) => {
  try {
    const { orderId } = req.body;
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) return res.status(404).json({ error: "Order not found" });

    // Fake payment processing
    dbOrder.paymentStatus = "Pending";
    await dbOrder.save();

    res.json({
      message: "Payment gateway not implemented yet. Order created as pending.",
      orderId: dbOrder._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create placeholder order" });
  }
});

/**
 * Placeholder: Verify payment route
 * Always returns failure since no real gateway is connected
 */
router.post("/verify-payment", auth(["retailer"]), async (req, res) => {
  try {
    return res.status(501).json({
      success: false,
      message: "Payment verification not implemented yet.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
