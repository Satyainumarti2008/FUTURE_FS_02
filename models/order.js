const mongoose = require('mongoose');
<<<<<<< HEAD

=======
>>>>>>> 5fa69b82b0bde5458ad775c0e7572390f45ffdc2
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
<<<<<<< HEAD

module.exports = mongoose.model("Order", orderSchema);
=======
module.exports = mongoose.model("Order", orderSchema);
>>>>>>> 5fa69b82b0bde5458ad775c0e7572390f45ffdc2
