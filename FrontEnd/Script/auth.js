document.addEventListener("DOMContentLoaded", function() {
    // Sprawdzanie, czy użytkownik jest zalogowany
    if (sessionStorage.getItem("loggedIn") === "true") {
        // Ukrywanie przycisku logowania
        document.getElementById("loginButtonDiv").style.visibility = "hidden";
    }
});