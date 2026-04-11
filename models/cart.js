const mongoose = require('mongoose');
<<<<<<< HEAD

=======
>>>>>>> 5fa69b82b0bde5458ad775c0e7572390f45ffdc2
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    default: 1
  }
},{ timestamps:true });
<<<<<<< HEAD

module.exports = mongoose.model('Cart', cartSchema);
=======
module.exports = mongoose.model('Cart', cartSchema);
>>>>>>> 5fa69b82b0bde5458ad775c0e7572390f45ffdc2
