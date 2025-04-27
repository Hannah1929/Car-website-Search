// LoginPage.JS

// Hilfsfunktionen
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen von ${url}: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        alert("Ein Fehler ist aufgetreten. Bitte versuche es später noch einmal.");
        throw error; // Wichtig: Fehler weiterwerfen
    }
}

function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

function clearForm(form) {
    form.reset();
}

function hideElement(element) {
    element.style.display = "none";
}

function showElement(element) {
    element.style.display = "block";
}

// Globale Variable für Benutzerdaten
let MOCK_DATA = []; // Stelle sicher, dass MOCK_DATA-2.json mit deinen Benutzerdaten gefüllt ist

// Daten laden
async function loadMockData() {
    try {
        MOCK_DATA = await fetchData('MOCK_DATA-2.json');
        console.log("Benutzerdaten erfolgreich geladen:", MOCK_DATA);
    } catch (error) {
        // Fehlerbehandlung erfolgt in fetchData
        // Hier ggf. weitere spezifische Behandlung für das Laden der Benutzerdaten
    }
}

// Hauptlogik
document.addEventListener("DOMContentLoaded", async function() {
    try {
        await loadMockData(); // Benutzerdaten laden
    } catch (error) {
        // Fehler wurde bereits in fetchData behandelt, hier ggf. weitere Aktionen
        return;
    }

    const showLoginPageButton = document.getElementById("ShowLoginPage");
    const showNewUserPageButton = document.getElementById("ShowNewUserPage");
    const loginFormElement = document.getElementById("LoginForm");
    const newUserFormElement = document.getElementById("NewUserForm");

    // Seitenwechsel-Logik
    if (showLoginPageButton && showNewUserPageButton && loginFormElement && newUserFormElement) {
        showLoginPageButton.addEventListener("click", () => {
            showElement(loginFormElement);
            hideElement(newUserFormElement);
        });

        showNewUserPageButton.addEventListener("click", () => {
            showElement(newUserFormElement);
            hideElement(loginFormElement);
        });
    } else {
        console.error("Fehler: Benutzerverwaltungs-Elemente nicht gefunden.");
        return;
    }

    // Registrierungsformular
    const newUserForm = document.querySelector('#NewUserForm form');
    if (newUserForm) {
        newUserForm.addEventListener("submit", handleNewUserSubmit);
    } else {
        console.error("Fehler: Registrierungsformular nicht gefunden.");
    }

    // Anmeldeformular
    const loginForm = document.querySelector('#LoginForm form');
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    } else {
        console.error("Fehler: Anmeldeformular nicht gefunden.");
    }
});

// Handler für das Registrierungsformular
function handleNewUserSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = getFormData(form);

    const { email, password, confirm_password } = formData;

    if (password !== confirm_password) {
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

    clearForm(form);
    document.getElementById("ShowLoginPage").click(); // Verwende die Konstante
}

// Handler für das Anmeldeformular
function handleLoginSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = getFormData(form);

    const { username, password } = formData;

    const user = MOCK_DATA.find(user => user.email === username && user.password === password);

    if (user) {
        window.location.href = `/Overview/Overview.html?userId=${user.id}`;
    } else {
        alert("Benutzername oder Passwort ist falsch!");
    }
}