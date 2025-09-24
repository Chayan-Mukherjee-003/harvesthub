import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    type: {
      type: String,
      enum: ['Ready-Made', 'To-be-Made'], // only these values allowed
      default: 'Ready-Made',
    },
    eta: { type: String },                  // estimated availability time
    imageUrl: { type: String },
    description: { type: String },
    availableQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cropSchema.index({ name: 'text' });
cropSchema.index({ farmerId: 1 });

export default mongoose.model('Crop', cropSchema);
