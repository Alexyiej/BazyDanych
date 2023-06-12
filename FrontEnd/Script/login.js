document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Wystąpił błąd podczas logowania');
        }
        return response.json();
    })
    .then(data => {
        if (data.loggedIn) {
            sessionStorage.setItem("loggedIn", "true");
            window.location.href = "/Main.html";
        } else {
            alert("Login lub hasło jest błędne");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
