import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
      enum: ['Small', 'Medium', 'Large'], // Future consistency
    },
    weightLimit: {
      type: Number,
      required: [true, 'Weight limit (in kg) is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Package price is required'],
    },
    image: {
      type: String,
      default: 'https://cdn.app/default-bag.png', // তোমার UI তে থাকা bag image
    },
    deliveryTime: {
      type: String,
      default: '2 Days',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Package', packageSchema);
