import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    cuisine: [{ type: String }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: Number, // in minutes
      default: 30,
    },
    priceForTwo: {
      type: Number,
      default: 200,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    offers: [
      {
        title: String,
        description: String,
      },
    ],
    categories: [{ type: String }],
    minOrder: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
