const events = [
    { name: 'Settlement of the Lenape', lat: 39.13, lon: -75.13 },
    { name: 'Declaration of Independence (1776)', lat: 39.9526, lon: -75.1652 },
    { name: 'Whiskey Rebellion (1794)', lat: 40.4406, lon: -79.9959 },
    { name: 'Louisiana Purchase (1803)', lat: 37.9643, lon: -91.8318 },
    { name: 'Chinese Communists Rise', lat: 50.5663, lon: 114.1322 },
    { name: 'Battle of Waterloo (1815)', lat: 50.678056, lon: 4.412222 },
    { name: 'Signing of the Treaty of Versailles (1919)', lat: 48.8049, lon: -2.1204 },
    { name: 'Fall of the Berlin Wall (1989)', lat: 52.52, lon: -13.405 },
    { name: 'D-Day Invasion (1944)', lat: 49.1242, lon: -0.6173 },
    { name: 'I Have a Dream Speech (1963)', lat: 38.9072, lon: -77.0369 },
    { name: 'Apartheid End (1994)', lat: 26.2041, lon: -28.0473 },
    { name: 'Alaska Good Friday Earthquake (1964)', lat: 61.1308, lon: 146.3483 },
    { name: 'Exxon Valdez Oil Spill in Prince William Sound (1989)', lat: 60.8833, lon: 147.8036 },
    { name: 'Ute Indian Removal', lat: 37.2172, lon: 108.4765 },
    { name: 'Founding of Hartford (1635)', lat: 41.7659, lon: -72.6816 },
    { name: 'Battle of Olustee (1864)', lat: 30.2036, lon: -82.4014 },
    { name: 'Founding of Savannah (1733)', lat: 32.0809, lon: -81.0912 },
    { name: 'Attack on Pearl Harbor (1941)', lat: 21.348, lon: -157.973 },
    { name: 'Fort Dearborn Massacre (1812)', lat: 41.8875, lon: -87.6191 },
    { name: 'Haymarket Affair (1886)', lat: 41.8836, lon: -87.6446 },
    { name: 'Battle of Tippecanoe (1811)', lat: 40.5408, lon: -86.8485 },
    { name: 'Indianapolis Motor Speedway Opening (1909)', lat: 39.795, lon: -86.2342 },
    { name: "Quantrill's Raid on Lawrence (1863)", lat: 38.9717, lon: -95.2353 },
    { name: 'Battle of Lobositz', lat: 50.512778, lon: 14.033333 },
    { name: 'Minquas Attacks', lat: 40.3363, lon: -76.4604 },
    { name: 'Discovery of the Delaware Bay and River', lat: 39.07, lon: -75.17 },
    { name: 'Battle of Mogadishu (1993)', lat: 2.0525, lon: 45.324722 },
    { name: 'Battle of Thermopylae', lat: 38.795833, lon: 22.536944 },
    { name: 'Battle of Bulge', lat: 50.004167, lon: 5.72 },
    { name: 'Battle of Little Bighorn (1876)', lat: 45.565, lon: -107.428889 },
    { name: 'Battle of the Alamo (1836)', lat: 29.425556, lon: -98.486111 },
    { name: 'Battle of Quebec (1775)', lat: 46.815, lon: -71.202222 },
    { name: 'Battle of Quifangondo (1975)', lat: 8.761111, lon: 13.408889 },
    { name: 'Battle of Waterloo (1815)', lat: 50.678056, lon: 4.412222 },
    { name: 'Battle of Wood Lake (1862)', lat: 44.701111, lon: -95.435833 },
    { name: 'Battle of Ain Jusk (1943)', lat: 36.1, lon: 51.7 },
    { name: 'Battle of Lut (1260)', lat: 32.5506, lon: 35.3569 },
    { name: 'Battle of Eylau (1807)', lat: 54.4, lon: 20.633333 },
    { name: 'Battle of Lake Erie (1813)', lat: 41.662222, lon: -82.825 },
    { name: 'Battle of Kur/Marathon (490 BC)', lat: 38.118056, lon: 23.978333 },
    { name: 'Battle of Monte Cassino (1944)', lat: 41.483333, lon: 13.816667 },
    { name: 'Battle of Chosin Reservoir (1950)', lat: 40.37, lon: 127.26 },
    { name: 'Ia Drang Valley (1965)', lat: 13.583333, lon: 107.716667 },
    { name: 'Battle of X (1944)', lat: 24.8167, lon: 93.95 },
    { name: 'Battle of Uhud (625)', lat: 24.5, lon: 39.61 },
    { name: 'Second Battle of Bull Run (1862)', lat: 38.81246, lon: -77.52131 },
];

function findLocation() {
    if (!('geolocation' in navigator)) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            const sortedEvents = events
                .map((event) => ({
                    ...event,
                    distance: getDistance(userLat, userLon, event.lat, event.lon),
                }))
                .sort((a, b) => a.distance - b.distance);

            displayEvents(sortedEvents.slice(0, 3));
        },
        (error) => {
            console.error('Error getting location:', error);
            alert(`Error getting location: ${error && error.message ? error.message : 'Unknown error'}`);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function getDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371; // Radius of the earth in km

    if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || !Number.isFinite(lat2) || !Number.isFinite(lon2)) {
        return Infinity;
    }

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function displayEvents(eventsList) {
    const eventsDiv = document.getElementById('events');
    if (!eventsDiv) return;

    if (!eventsList || eventsList.length === 0) {
        eventsDiv.innerHTML = '<p>No events to show.</p>';
        return;
    }

    eventsDiv.innerHTML = '';
    eventsList.forEach((event) => {
        const distanceText = Number.isFinite(event.distance) ? `${event.distance.toFixed(2)} km away` : 'distance unknown';
        eventsDiv.innerHTML += `<p>${escapeHtml(event.name)} — ${distanceText}.</p>`;
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
