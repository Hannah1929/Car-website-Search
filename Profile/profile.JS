document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search); // get userid from URL
    const userId = urlParams.get('userId');
    
    if (!userId) {
        alert("Keine Benutzer-ID gefunden.");
        return;
    }

    // load user & cardata
    Promise.all([
        fetch('/Car-website-Search/Login/MOCK_DATA-2.json').then(res => res.json()),
        fetch('cars.json').then(res => res.json())
    ])
    .then(([users, cars]) => {
        // Find User data
        const user = users.find(u => u.id === parseInt(userId));

        if (user) {
            // Show User Profile
            console.log('1');
            const profileDetails = document.getElementById('profileDetails');
            profileDetails.innerHTML = `
                <p><strong>Name:</strong> ${user.first_name} ${user.last_name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Adresse:</strong> ${user.address}</p>
            `;
            console.log('2');

            // Show favorite Cars
            const favoriteCarsContainer = document.getElementById('favoriteCars');
            const favoriteCars = cars.filter(car => user.favorite_cars.includes(car.id));

            if (favoriteCars.length > 0) {
                favoriteCarsContainer.innerHTML = favoriteCars.map(car => `
                    <div class="car-card">
                        <img src="${car.image || 'https://via.placeholder.com/400x300?text=Kein+Bild'}" alt="${car.title}">
                        <h3>${car.title}</h3>
                    </div>
                `).join('');
                console.log('');

            } else {
                favoriteCarsContainer.innerHTML = '<p>Keine favorisierten Autos gefunden.</p>';
            }
        } else {
            alert("Benutzer nicht gefunden.");
        }
    })
    .catch(error => {
        console.error("Fehler beim Laden der Daten:", error);
    });
});

function changesite(){
    const urlParams = new URLSearchParams(window.location.search);        
    const userId = urlParams.get('userId');
    if (userId) {
        window.location.href = `/Car-website-Search/Overview/Overview.html?userId=${userId}`;
    } else {
        alert("Kein User-Id in der URL gefunden.");
    }

}
