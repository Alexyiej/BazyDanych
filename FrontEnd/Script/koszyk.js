document.addEventListener("DOMContentLoaded", function() {
    var productButtons = document.querySelectorAll(".Product_button");
  
    productButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        var productName = this.parentElement.querySelector("span p:first-child").textContent;
        var productPrice = parseFloat(this.parentElement.querySelector("span p:last-child").textContent.replace('$', ''));
  
        var cart = JSON.parse(localStorage.getItem("cart")) || [];
  
        cart.push({
          name: productName,
          price: productPrice
        });
  
        localStorage.setItem("cart", JSON.stringify(cart));
        updateTotalPrice();
        displayCartItems();
      });
    });
  
    function displayCartItems() {
      var cartItems = document.getElementById("cart_items");
  
      while (cartItems.firstChild) {
        cartItems.removeChild(cartItems.firstChild);
      }
  
      var cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      cart.forEach(function(item, index) {
        var itemElement = document.createElement("div");
        var removeButton = document.createElement("button");
  
        itemElement.innerHTML = item.name + " - $" + item.price + " ";
        itemElement.style.display = "flex";
        itemElement.style.justifyContent = "space-between";
        itemElement.style.width = "100%";
  
        removeButton.innerHTML = "X";
        removeButton.style.color = "red";
        removeButton.style.backgroundColor = "transparent";
        removeButton.style.border = "none";
        removeButton.style.cursor = "pointer";
        removeButton.addEventListener("click", function() {
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          displayCartItems();
          updateTotalPrice();
        });
  
        itemElement.appendChild(removeButton);
        cartItems.appendChild(itemElement);
      });
    }
  
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
});
console.log(localStorage.getItem("cart"));
console.log(localStorage.getItem("totalPrice"));




