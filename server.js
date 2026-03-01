const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://esawr:eswar@cluster0.ioa8vl8.mongodb.net/login?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
app.listen(5000, () => console.log("Server running"));

app.get('/signup', (req, res) => {
  res.sendFile('./public/signup.html', { root: __dirname });
})
app.get('/login', (req, res) => {
  res.sendFile('./public/login.html', { root: __dirname });
})
app.get('/home', (req, res) => {
  res.sendFile('./public/home.html', { root: __dirname });
})
app.get('/breakfast', (req, res) => {
  res.sendFile('./public/breakfast.html', { root: __dirname });
})
app.get('/lunch', (req, res) => {
  res.sendFile('./public/lunch.html', { root: __dirname });
})
app.get('/dinner', (req, res) => {
  res.sendFile('./public/dinner.html', { root: __dirname });
})
app.get('/snacks', (req, res) => {
  res.sendFile('./public/snacks.html', { root: __dirname });
})
app.get('/cart', (req, res) => {
  res.sendFile('./public/cart.html', { root: __dirname });
})
app.post('/signup', async (req, res) => {
  // const { fullName, email, password } = req.body;
  const user = new User(req.body);
  user.save()
    .then(() => res.redirect('/login'))
    .catch(err => res.send(err));
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.send("Login success");
  } else {
    res.send("Invalid credentials");
  }
})

// app.post("/place-order", async (req, res) => {
//   try {
//     const { customerName, items, totalAmount } = req.body;

//     const newOrder = new Order({
//       customerName,
//       items,
//       totalAmount
//     });

//     await newOrder.save();

//     res.status(201).json({ message: "Order placed successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });
/* =======================
   ORDER SCHEMA
======================= */
const orderSchema = new mongoose.Schema({
    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    total: Number,
    status: {
        type: String,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

/* =======================
   ROUTES
======================= */

// 🔹 Create Order (from cart page)
app.post("/api/orders", async (req, res) => {
    try {
        const { items } = req.body;

        // 🔴 Safety Check
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No items provided" });
        }

        // 🔵 Calculate total
        const total = items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        const newOrder = new Order({
            items,
            total
        });

        await newOrder.save();

        // 🔵 Send Order ID back
        res.json({
            message: "Order placed successfully",
            orderId: newOrder._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
// 🔹 Get All Orders (Admin Dashboard)
app.get("/api/orders", async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

// 🔹 Mark Order Complete
app.put("/api/orders/:id", async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, {
        status: "Completed"
    });
    res.json({ message: "Order marked as completed" });
});

// 🔹 Delete Order (optional)
app.delete("/api/orders/:id", async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});