document.addEventListener("DOMContentLoaded", () => {

  function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartList = document.getElementById("cartList");
    let grandTotal = 0;

    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="empty-msg">
          Your cart is empty 🛒
        </div>`;
      document.getElementById("grandTotal").innerText = "0";
      return;
    }

    let grouped = {};

    cart.forEach(item => {
      if (!grouped[item.name]) {
        grouped[item.name] = {
          name: item.name,
          price: Number(item.price),
          quantity: 1
        };
      } else {
        grouped[item.name].quantity++;
      }
    });

    cartList.innerHTML = "";

    Object.values(grouped).forEach(item => {
      let itemTotal = item.price * item.quantity;
      grandTotal += itemTotal;

      cartList.innerHTML += `
        <div class="cart-item">
          <div class="item-info">
            <span class="item-name">${item.name}</span>
            <div class="qty-controls">
              <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
            </div>
          </div>
          <span class="item-price">₹${itemTotal}</span>
        </div>
      `;
    });

    document.getElementById("grandTotal").innerText = grandTotal;
  }

  function changeQty(itemName, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (delta === 1) {
      let item = cart.find(i => i.name === itemName);
      if (item) cart.push({ ...item });
    } else {
      let index = cart.map(i => i.name).lastIndexOf(itemName);
      if (index > -1) cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }

  function clearCart() {
    localStorage.removeItem("cart");
    displayCart();
  }

  async function placeOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Add items first!");
      return;
    }

    let grouped = {};

    cart.forEach(item => {
      if (!grouped[item.name]) {
        grouped[item.name] = {
          name: item.name,
          price: Number(item.price),
          quantity: 1
        };
      } else {
        grouped[item.name].quantity++;
      }
    });

    let items = Object.values(grouped);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });

      if (!response.ok) throw new Error("Order failed");

      const data = await response.json();

      alert("Order Placed! ID: " + data.orderId);

      localStorage.removeItem("cart");
      window.location.href = "/home";

    } catch (error) {
      alert("Server error!");
      console.error(error);
    }
  }

  window.changeQty = changeQty;
  window.placeOrder = placeOrder;
  window.clearCart = clearCart;

  displayCart();
});