function updateQty(name, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (change === 1) {
    // Find item safely
    let item = cart.find(i => i.name === name);
    if (item) {
      cart.push({ name: item.name, price: item.price });
    }
  } else {
    // Remove one item safely
    let index = cart.findIndex(i => i.name === name);
    if (index !== -1) {
      cart.splice(index, 1);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}