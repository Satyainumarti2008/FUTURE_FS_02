require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const Order = require("./models/order"); 
const app = express();
const bcrypt = require("bcrypt")
// ================= MIDDLEWARE =================
app.use(express.json({
  limit: "1mb"
}));

app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use(express.static("public"));


// ================= MONGODB CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// ================= PAGE ROUTES =================

app.get('/signup', (req, res) => {
  res.sendFile('./public/signup.html', { root: __dirname });
});

app.get('/', (req, res) => {
  res.sendFile('./public/login.html', { root: __dirname });
});

app.get('/home', (req, res) => {
  res.sendFile('./public/home.html', { root: __dirname });
});

app.get('/breakfast', (req, res) => {
  res.sendFile('./public/breakfast.html', { root: __dirname });
});

app.get('/lunch', (req, res) => {
  res.sendFile('./public/lunch.html', { root: __dirname });
});

app.get('/dinner', (req, res) => {
  res.sendFile('./public/dinner.html', { root: __dirname });
});

app.get('/snacks', (req, res) => {
  res.sendFile('./public/snacks.html', { root: __dirname });
});

app.get('/drinks', (req, res) => {
  res.sendFile('./public/drinks.html', { root: __dirname });
});

app.get('/salads', (req, res) => {
  res.sendFile('./public/salads.html', { root: __dirname });
});

app.get('/cart', (req, res) => {
  res.sendFile('./public/cart.html', { root: __dirname });
});

app.get('/orders', (req, res) => {
  res.sendFile('./public/orderdash.html', { root: __dirname });
});

app.get('/orderdash', (req, res) => {
  res.sendFile('./public/orderdash.html', { root: __dirname });
});

app.get('/admin1', (req, res) => {
  res.sendFile('./public/admin1.html', { root: __dirname });
});
// ================= AUTH ROUTES =================
app.post("/api/signup", async (req, res) => {
  console.log("🔥 SIGNUP API HIT");

  try {
    const { fullName, email, password } = req.body;
    const lowerEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }
    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email: lowerEmail,
      password:hashedPassword
    });
    return res.json({
      success: true,
      message: "Account created successfully"
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "User already exists"
    });
  }
});
// ================= ORDER ROUTES =================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }
    // 🔐 COMPARE PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Wrong password"
      });
    }
    return res.json({
      success: true,
      role: user.role,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Server error"
    });
  }
});
app.post("/api/send-otp", async (req, res) => {
  console.log("🔥 SEND OTP API HIT");
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    console.log("📩 OTP:", otp); // 👈 THIS WILL PRINT
    res.json({
      success: true,
      message: "OTP generated (check console)"
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});
app.post("/api/reset-password", async (req, res) => {
  console.log("🔥 RESET PASSWORD API HIT");
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // ✅ CHECK OTP
    if (user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    // ✅ CHECK EXPIRY
    if (user.otpExpiry < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    // 🔐 HASH NEW PASSWORD
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    // 🔥 CLEAR OTP
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    console.log("✅ Password reset success");
    res.json({
      success: true,
      message: "Password reset successful"
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});
// ✅ CREATE ORDER
// ================= ORDER CREATE =================
app.post("/api/orders", async (req, res) => {
  console.log("BODY:", req.body);   
  try {
    const { email, items, totalPrice } = req.body;

    // ✅ validation
    if (!email || !items || items.length === 0 || totalPrice == null) {
  return res.status(400).json({ message: "Missing required fields" });
}

    const newOrder = new Order({
      email,
      items,
      totalPrice
    });

    await newOrder.save();

    res.json({ message: "Order saved successfully" });

  } catch (err) {
    console.log("ERROR:", err);   // 🔥 see exact error
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/myorders/:email", async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();

    console.log("Fetching orders for:", email);

    const orders = await Order.find({ email: email });

    res.json(orders);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();

    console.log("All orders:", orders); // ✅ debug

    res.json(orders);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// MARK ORDER COMPLETE
app.put("/api/orders/:id", async (req, res) => {

  try {

    await Order.findByIdAndUpdate(req.params.id, {
      status: "Completed"
    });

    res.json({ message: "Order marked as completed" });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

});


// 🔹 Delete Order
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// ================= USERS COUNT API =================

app.get("/api/users/count", async (req,res)=>{
  try{
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  }
  catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
  }
});

// 🔥 GLOBAL ERROR HANDLER (ADD THIS AT END)
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Server error"
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});