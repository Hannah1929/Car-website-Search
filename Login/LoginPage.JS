let MOCK_DATA = [];

async function loadMockData() {
    try {
        const response = await fetch('/Login/MOCK_DATA-2.json');
        MOCK_DATA = await response.json();
    } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    await loadMockData(); 

    const showLoginPage = document.getElementById("ShowLoginPage");
    const showNewUserPage = document.getElementById("ShowNewUserPage");
    const loginForm = document.getElementById("LoginForm");
    const newUserForm = document.getElementById("NewUserForm");

    showLoginPage.addEventListener("click", function() {
        loginForm.style.display = "block";
        newUserForm.style.display = "none";
    });

    showNewUserPage.addEventListener("click", function() {
        newUserForm.style.display = "block";
        loginForm.style.display = "none";
    });

    const newUserFormElement = document.querySelector('#NewUserForm form');
    newUserFormElement.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = newUserForm.querySelector('input[name="email"]').value;
        const password = newUserForm.querySelector('input[name="password"]').value;
        const confirmPassword = newUserForm.querySelector('input[name="confirm_password"]').value;

        if (password !== confirmPassword) {
            alert("Passwörter stimmen nicht überein!");
            return;
        }

        const existingUser = MOCK_DATA.find(user => user.email === email);
        if (existingUser) {
            alert("E-Mail wird bereits verwendet!");
            return;
        }

        const newUser = {
            id: MOCK_DATA.length + 1,
            first_name: "",  // kannst du hier abfragen falls gewünscht
            last_name: "",
            email: email,
            password: password,
            address: "",
            favorite_cars: []
        };

        MOCK_DATA.push(newUser);
        alert("Benutzer erfolgreich erstellt!");

        // Hier müsstest du theoretisch die neue Datei zurück an den Server schicken (geht nur mit Backend!)
        console.log("Aktueller Stand der User-Daten:", MOCK_DATA);

        newUserFormElement.reset();
        showLoginPage.click();
    });

    const loginFormElement = document.querySelector('#LoginForm form');
    loginFormElement.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = loginForm.querySelector('input[name="username"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;

        const user = MOCK_DATA.find(user => user.email === username && user.password === password);

        if (user) {
            window.location.href = `/Overview/Overview.html?userId=${user.id}`;
        } else {
            alert("Benutzername oder Passwort ist falsch!");
        }
    });
});
