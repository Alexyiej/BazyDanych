document.addEventListener("DOMContentLoaded", function() {
  updateTotalPrice();

  var payButton = document.getElementById("payButton");
  payButton.addEventListener("click", function(event) {
    event.preventDefault(); // Zatrzymuje domyślne zachowanie formularza

    var address = document.querySelector('input[name="address"]').value;
    var email = document.querySelector('input[name="email"]').value;
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var totalPrice = JSON.parse(localStorage.getItem("totalPrice")) || 0;
    var priceElement = document.getElementById("totalPrice");
    priceElement.textContent = "Total Price: $" + totalPrice.toFixed(2);

    if (address.trim() === "" || email.trim() === "") {
      alert("Please fill in all the required fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your shopping cart is empty. Please add items before proceeding.");
      return;
    }

    // Sprawdzanie, czy użytkownik jest zalogowany
    if (sessionStorage.getItem("loggedIn") !== "true") {
      // Wyświetlanie popupu z informacją o konieczności zalogowania
      alert("You must be logged in!");
      setTimeout(function() {
        window.location.href = "/subpages/Login_Page.html";
      }, 3000);

      return;
    }

    fetch('/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, email, cart, totalPrice }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Wystąpił błąd podczas tworzenia zamówienia');
      }
      return response.text();
    })
    .then(data => {
      console.log(data);
      localStorage.removeItem("cart");
      localStorage.removeItem("totalPrice");
      location.href = '/main.html';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
});

function updateTotalPrice() {
  var totalPrice = JSON.parse(localStorage.getItem("totalPrice")) || 0;
  var priceElement = document.getElementById("totalPrice");
  priceElement.textContent = "Total Price: $" + totalPrice.toFixed(2);
}

console.log(localStorage.getItem("cart"));
console.log(localStorage.getItem("totalPrice"));
