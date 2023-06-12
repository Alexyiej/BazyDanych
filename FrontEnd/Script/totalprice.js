function updateTotalPrice( ) {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var totalPrice = cart.reduce(function(sum, item) {
      return sum + item.price;
    }, 0);

    var priceElement = document.getElementById("totalPrice");
    priceElement.textContent = "Total Price: $" + totalPrice.toFixed(2);

    localStorage.setItem("totalPrice", totalPrice.toFixed(2));
  }

  displayCartItems();
  updateTotalPrice();