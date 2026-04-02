const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: {         
    type: String,
    required: true
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
