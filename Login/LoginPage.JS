let cars = [];
let MOCK_DATA = []; // Stelle sicher, dass diese Variable mit deinen Benutzerdaten gefüllt wird (z.B. in einem separaten <script>-Tag)

async function loadMockData() {
    try {
        const response = await fetch('cars.json');
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        cars = await response.json();
        console.log("Auto-Daten erfolgreich geladen:", cars);
        // Hier könntest du Code einfügen, um die Autodaten anzuzeigen, falls das noch relevant ist
    } catch (error) {
        console.error("Fehler beim Laden der Auto-Daten:", error);
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    await loadMockData(); // Nur einmal aufrufen

    const showLoginPage = document.getElementById("ShowLoginPage");
    const showNewUserPage = document.getElementById("ShowNewUserPage");
    const loginForm = document.getElementById("LoginForm");
    const newUserForm = document.getElementById("NewUserForm");

    if (showLoginPage && showNewUserPage && loginForm && newUserForm) {
        showLoginPage.addEventListener("click", function() {
            loginForm.style.display = "block";
            newUserForm.style.display = "none";
        });

        showNewUserPage.addEventListener("click", function() {
            newUserForm.style.display = "block";
            loginForm.style.display = "none";
        });
    } else {
        console.error("Ein oder mehrere benötigte Elemente für die Benutzerverwaltung wurden nicht gefunden.");
        return;
    }

    const newUserFormElement = document.querySelector('#NewUserForm form');
    if (newUserFormElement) {
        newUserFormElement.addEventListener("submit", function(event) {
            event.preventDefault();

            const emailInput = newUserForm.querySelector('input[name="email"]');
            const passwordInput = newUserForm.querySelector('input[name="password"]');
            const confirmPasswordInput = newUserForm.querySelector('input[name="confirm_password"]');

            if (!emailInput || !passwordInput || !confirmPasswordInput) {
                console.error("Ein oder mehrere Eingabefelder im Registrierungsformular wurden nicht gefunden.");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

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
                first_name: "",
                last_name: "",
                email: email,
                password: password,
                address: "",
                favorite_cars: []
            };

            MOCK_DATA.push(newUser);
            alert("Benutzer erfolgreich erstellt!");
            console.log("Aktueller Stand der User-Daten:", MOCK_DATA);

            newUserFormElement.reset();
            if (showLoginPage) {
                showLoginPage.click();
            }
        });
    } else {
        console.error("Das Registrierungsformular wurde nicht gefunden.");
    }

    const loginFormElement = document.querySelector('#LoginForm form');
    if (loginFormElement) {
        loginFormElement.addEventListener("submit", function(event) {
            event.preventDefault();

            const usernameInput = loginForm.querySelector('input[name="username"]');
            const passwordInput = loginForm.querySelector('input[name="password"]');

            if (!usernameInput || !passwordInput) {
                console.error("Ein oder mehrere Eingabefelder im Anmeldeformular wurden nicht gefunden.");
                return;
            }

            const username = usernameInput.value;
            const password = passwordInput.value;

            const user = MOCK_DATA.find(user => user.email === username && user.password === password);

            if (user) {
                window.location.href = `/Overview/Overview.html?userId=${user.id}`;
            } else {
                alert("Benutzername oder Passwort ist falsch!");
            }
        });
    } else {
        console.error("Das Anmeldeformular wurde nicht gefunden.");
    }
});