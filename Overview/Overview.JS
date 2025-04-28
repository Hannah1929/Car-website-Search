let cars = [];
let filteredCars = []; // Initalisation, later will be filled with data
let currentPage = 1;
const carsPerPage = 8;
let totalPages = 0; // pagination

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
        filteredCars = [...cars]; // // Initialise filteredCars after loading
        console.log("Daten erfolgreich geladen:", cars);

        // Initial display and pagination after loading the data
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
            pagination.style.display = 'none'; // Hide pagination, if error
        }
    }
}



function updateFavoritesOnServer(userId, carId) {
    const data = {
        userId: userId,
        carId: carId
    };

    fetch('update_favorites.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Favoriten wurden erfolgreich aktualisiert.");
        } else {
            console.error("Fehler beim Aktualisieren der Favoriten: " + data.message);
        }
    })
    .catch(error => {
        console.error("Es gab einen Fehler:", error);
    });
}


function displayCars(page) {
    const container = document.getElementById('carContainer');
    if (!container) {
        console.error("Das Element mit der ID 'carContainer' wurde nicht gefunden.");
        return;
    }

    const startIndex = (page - 1) * carsPerPage;
    const endIndex = page * carsPerPage;
    const carsToDisplay = filteredCars.slice(startIndex, endIndex);

    container.innerHTML = ''; 

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
            <svg id="svg${car.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.769-8.852-8.346-12-2.944z"/>
            </svg>
        `;
        container.appendChild(carDiv);
        const carsvg = document.getElementById('svg' + car.id);
        
        if (carsvg) {
            const urlParams = new URLSearchParams(window.location.search);
            
            const userId = urlParams.get('userId');
            if (!userId) {
                console.warn("Kein userId in der URL gefunden.");
            }
            console.log(userId);

            carsvg.addEventListener('click', function () {
                console.log('CLICKED');
                updateFavoritesOnServer(userId, car.id);
            });
        } else {
            console.error(`SVG für Auto mit ID ${car.id} nicht gefunden.`);
        }

        console.log(`Zeige Seite ${page} mit ${carsToDisplay.length} Autos.`);
    });
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
            nextButton.disabled = currentPage === totalPages || totalPages === 0; // Deactivate "Weiter" if no pages are available

            if (totalPages <= 1) {
                paginationContainer.style.display = 'none'; // Hide pagination if only one page or no data is available
            } else {
                paginationContainer.style.display = 'block';
            }

            console.log(`Paginierung eingerichtet: ${totalPages} Seiten.`);
        }

// Page change function
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

            currentPage = 1; // Set back on site 1 after filter
            displayCars(currentPage);
            setupPagination();
            console.log(`Filter angewendet. ${filteredCars.length} Autos gefunden.`);
        }

function changesite(){
    const urlParams = new URLSearchParams(window.location.search);        
    const userId = urlParams.get('userId');
    if (userId) {
        window.location.href = `/Car-website-Search/Profile/profile.html?userId=${userId}`;
    } else {
        alert("Kein User-Id in der URL gefunden.");
    }

}

loadMockData();