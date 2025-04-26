let cars = [];
let filteredCars = []; // Initialisierung hier, wird später mit Daten gefüllt
let currentPage = 1;
const carsPerPage = 8;
let totalPages = 0; // Für die Paginierung

async function loadMockData() {
    try {
        console.log("Starte das Laden der Daten...");
        const response = await fetch('cars.json');
        if (!response.ok) {
            console.error("Fehler beim Laden der Daten. Antwortstatus:", response.status);
            throw new Error(`Netzwerkantwort war nicht ok: ${response.status}`);
        }
        const data = await response.json();
        cars = data;
        filteredCars = [...cars]; // Initialisiere filteredCars nach dem Laden
        console.log("Daten erfolgreich geladen:", cars);

        // Initiale Anzeige und Paginierung nach dem Laden der Daten
        displayCars(currentPage);
        setupPagination();

    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        const container = document.getElementById('carContainer');
        if (container) {
            container.innerHTML = '<p class="error">Fehler beim Laden der Auto-Daten.</p>';
        }
        const pagination = document.getElementById('paginationContainer');
        if (pagination) {
            pagination.style.display = 'none'; // Verstecke die Paginierung bei Fehler
        }
    }
}

// Funktion zum Anzeigen der Autos
function displayCars(page) {
    const container = document.getElementById('carContainer');
    if (!container) {
        console.error("Das Element mit der ID 'carContainer' wurde nicht gefunden.");
        return;
    }

    const startIndex = (page - 1) * carsPerPage;
    const endIndex = page * carsPerPage;
    const carsToDisplay = filteredCars.slice(startIndex, endIndex);

    container.innerHTML = ''; // Leere den Container vor dem Anzeigen

    if (carsToDisplay.length === 0) {
        container.innerHTML = '<p>Keine Autos gefunden.</p>';
        return;
    }

    carsToDisplay.forEach(car => {
        const carDiv = document.createElement('div');
        carDiv.className = 'car';
        carDiv.innerHTML = `
            <img src="${car.image || 'https://via.placeholder.com/400x300?text=Kein+Bild'}" alt="${car.title || 'Unbekanntes Auto'}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Kein+Bild';">
            <h3>${car.title || 'Unbekanntes Auto'}</h3>
            <p><strong>Klasse:</strong> ${car.class || 'Unbekannt'}</p>
            ${car.start_production ? `<p><strong>Produktionsstart:</strong> ${car.start_production}</p>` : ''}
        `;
        container.appendChild(carDiv);
    });

    console.log(`Zeige Seite ${page} mit ${carsToDisplay.length} Autos.`);
}

// Paginierungsfunktion
function setupPagination() {
    totalPages = Math.ceil(filteredCars.length / carsPerPage);
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageNumber = document.getElementById('pageNumber');
    const paginationContainer = document.getElementById('paginationContainer');

    if (!prevButton || !nextButton || !pageNumber || !paginationContainer) {
        console.error("Ein oder mehrere Paginierungselemente wurden nicht gefunden.");
        return;
    }

    pageNumber.textContent = `Seite ${currentPage} von ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0; // Deaktiviere "Weiter", wenn keine Seiten vorhanden sind

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none'; // Verstecke die Paginierung, wenn nur eine Seite oder keine Daten vorhanden sind
    } else {
        paginationContainer.style.display = 'block';
    }

    console.log(`Paginierung eingerichtet: ${totalPages} Seiten.`);
}

// Seitenwechsel
function changePage(direction) {
    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
        displayCars(currentPage);
        setupPagination();
        console.log(`Gehe zu Seite ${currentPage}.`);
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
        displayCars(currentPage);
        setupPagination();
        console.log(`Gehe zu Seite ${currentPage}.`);
    }
}

// Filterfunktion
function filterCars() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error("Das Element mit der ID 'searchInput' wurde nicht gefunden.");
        return;
    }
    const searchTerm = searchInput.value.toLowerCase();

    filteredCars = cars.filter(car => {
        return (
            (car.title && car.title.toLowerCase().includes(searchTerm)) ||
            (car.class && car.class.toLowerCase().includes(searchTerm))
        );
    });

    currentPage = 1; // Setze auf Seite 1 zurück nach dem Filtern
    displayCars(currentPage);
    setupPagination();
    console.log(`Filter angewendet. ${filteredCars.length} Autos gefunden.`);
}

// Diese Funktion rufen wir dann auf, um die Daten zu laden
loadMockData();