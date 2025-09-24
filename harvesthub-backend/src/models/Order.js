import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        cropId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Crop',
          required: true,
        },
        name: { type: String, required: true },  // snapshot of crop name
        qty: { type: Number, required: true },
        price: { type: Number, required: true }, // unit price at order time
      },
    ],
    totalAmount: { type: Number, required: true },
    upfrontAmount: { type: Number, default: 0 },
    upfrontPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Ready', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid'],
      default: 'Unpaid',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ retailerId: 1, createdAt: -1 });
orderSchema.index({ farmerId: 1, status: 1 });

export default mongoose.model('Order', orderSchema);
