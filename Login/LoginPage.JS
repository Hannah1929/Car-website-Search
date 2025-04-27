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

// global
let MOCK_DATA = []; 

// Load data
async function loadMockData() {
    try {
        MOCK_DATA = await fetchData('/Car-website-Search/Login/MOCK_DATA-2.json');
        console.log("Benutzerdaten erfolgreich geladen:", MOCK_DATA);
    } catch (error) {
       //error handling, mostly already done in 
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    try {
        await loadMockData(); 
    } catch (error) {
        return;
    }

    const showLoginPageButton = document.getElementById("ShowLoginPage");
    const showNewUserPageButton = document.getElementById("ShowNewUserPage");
    const loginFormElement = document.getElementById("LoginForm");
    const newUserFormElement = document.getElementById("NewUserForm");

    // Page change logic
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

    // Registration form
    const newUserForm = document.querySelector('#NewUserForm form');
    if (newUserForm) {
        newUserForm.addEventListener("submit", handleNewUserSubmit);
    } else {
        console.error("Fehler: Registrierungsformular nicht gefunden.");
    }

    // Login Form
    const loginForm = document.querySelector('#LoginForm form');
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    } else {
        console.error("Fehler: Anmeldeformular nicht gefunden.");
    }
});

async function handleNewUserSubmit(event) { // Does not work yet -> problems with PHP 
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const newUser = {
        first_name: formData.get('Firstname').trim(),
        last_name: formData.get('Lastname').trim(),
        email: formData.get('email').trim(),
        password: formData.get('password'),
        confirm_password: formData.get('confirm_password')
    };

    if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password) {
        alert("Alle Felder müssen ausgefüllt werden!");
        return;
    }

    if (newUser.password !== newUser.confirm_password) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }

    if (!/\S+@\S+\.\S+/.test(newUser.email)) {
        alert("Bitte eine gültige E-Mail-Adresse eingeben!");
        return;
    }

    if (newUser.password.length < 6) {
        alert("Das Passwort muss mindestens 6 Zeichen lang sein!");
        return;
    }

    try {
        const response = await fetch('/Car-website-Search/Login/create-user.php', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    
        const responseText = await response.text(); 
        console.log("Server-Antwort:", responseText); 
    
        const result = JSON.parse(responseText); 
    
        if (result.success) {
            alert('Benutzer erfolgreich erstellt!');
            form.reset();
            document.getElementById("ShowLoginPage").click();
        } else {
            alert('Fehler: ' + result.message);
        }
    } catch (error) {
        console.error('Fehler:', error);
        alert('Serverfehler!');
    }
    
}







// Handler für das Anmeldeformular
function handleLoginSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = getFormData(form);

    const { username, password } = formData;

    const user = MOCK_DATA.find(user => user.email === username && user.password === password);

    if (user) {
        window.location.href = `/Car-website-Search/Overview/Overview.html?userId=${user.id}`;
    } else {
        alert("Benutzername oder Passwort ist falsch!");
    }
}