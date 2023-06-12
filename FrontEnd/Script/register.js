document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const repeatPassword = document.querySelectorAll('input[type="password"]')[1].value;

    if (password !== repeatPassword) {
        alert("Hasła się nie zgadzają!");
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił błąd podczas rejestracji');
        }
        return response.text();
    })
    .then(data => {
        alert(data);
        window.location.href = '/subpages/Login_Page.html'; // Przekierowanie na stronę logowania
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
