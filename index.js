let useMiles = true; // default unit
window.lastSortedEvents = null;

const events = [
    { name: 'Settlement of the Lenape', lat: 39.13, lon: -75.13 },
    { name: 'Declaration of Independence (1776)', lat: 39.9526, lon: -75.1652 },
    { name: 'Whiskey Rebellion (1794)', lat: 40.4406, lon: -79.9959 },
    { name: 'Louisiana Purchase (1803)', lat: 37.9643, lon: -91.8318 },
    { name: 'Chinese Communists Rise', lat: 50.5663, lon: 114.1322 },
    { name: 'Battle of Waterloo (1815)', lat: 50.678056, lon: 4.412222 },
    { name: 'Signing of the Treaty of Versailles (1919)', lat: 48.8049, lon: 2.1204 },
    { name: 'Fall of the Berlin Wall (1989)', lat: 52.52, lon: 13.405 },
    { name: 'D-Day Invasion (1944)', lat: 49.1242, lon: -0.6173 },
    { name: 'I Have a Dream Speech (1963)', lat: 38.9072, lon: -77.0369 },
    { name: 'Apartheid End (1994)', lat: 26.2041, lon: 28.0473 },
    { name: 'Alaska Good Friday Earthquake (1964)', lat: 61.1308, lon: -146.3483 },
    { name: 'Exxon Valdez Oil Spill (1989)', lat: 60.8833, lon: -147.8036 },
    { name: 'Ute Indian Removal', lat: 37.2172, lon: -108.4765 },
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
    { name: 'Battle of the Bulge', lat: 50.004167, lon: 5.72 },
    { name: 'Battle of Little Bighorn (1876)', lat: 45.565, lon: -107.428889 },
    { name: 'Battle of the Alamo (1836)', lat: 29.425556, lon: -98.486111 },
    { name: 'Battle of Quebec (1775)', lat: 46.815, lon: -71.202222 },
    { name: 'Battle of Quifangondo (1975)', lat: 8.761111, lon: 13.408889 },
    { name: 'Battle of Wood Lake (1862)', lat: 44.701111, lon: -95.435833 },
    { name: 'Battle of Ain Jusk (1943)', lat: 36.1, lon: 51.7 },
    { name: 'Battle of Lut (1260)', lat: 32.5506, lon: 35.3569 },
    { name: 'Battle of Eylau (1807)', lat: 54.4, lon: 20.633333 },
    { name: 'Battle of Lake Erie (1813)', lat: 41.662222, lon: -82.825 },
    { name: 'Battle of Marathon (490 BC)', lat: 38.118056, lon: 23.978333 },
    { name: 'Battle of Monte Cassino (1944)', lat: 41.483333, lon: 13.816667 },
    { name: 'Battle of Chosin Reservoir (1950)', lat: 40.37, lon: 127.26 },
    { name: 'Ia Drang Valley (1965)', lat: 13.583333, lon: 107.716667 },
    { name: 'Battle of Uhud (625)', lat: 24.5, lon: 39.61 },
    { name: 'Second Battle of Bull Run (1862)', lat: 38.81246, lon: -77.52131 },
    { name: 'Battle of Jerusalem (1917)', lat: 31.776389, lon: 35.2275 },
];

function toggleUnits() {
    useMiles = !useMiles;
    document.getElementById("unitToggle").textContent = useMiles ? "Use km" : "Use miles";

    if (window.lastSortedEvents) {
        displayEvents(window.lastSortedEvents.slice(0, 3));
    }
}

function findLocation() {
    const eventsDiv = document.getElementById('events');
    eventsDiv.innerHTML = '<p>Locating…</p>';

    if (!navigator.geolocation) {
        eventsDiv.innerHTML = '<p>Your browser does not support geolocation.</p>';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;

            const sorted = events
                .map(e => ({
                    ...e,
                    distance: getDistance(latitude, longitude, e.lat, e.lon)
                }))
                .sort((a, b) => a.distance - b.distance);

            window.lastSortedEvents = sorted;

            displayEvents(sorted.slice(0, 3));
        },
        (err) => {
            const message = err.message || "Unable to retrieve your location";
            eventsDiv.innerHTML = `<p>Error: ${message}</p>`;
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deg2rad(d) {
    return d * Math.PI / 180;
}

function displayEvents(list) {
    const div = document.getElementById('events');
    div.innerHTML = '';

    list.forEach(e => {
        const km = e.distance;
        const miles = km * 0.621371;

        const text = useMiles
            ? `${miles.toFixed(2)} miles away`
            : `${km.toFixed(2)} km away`;

        div.innerHTML += `<p>${escapeHtml(e.name)} — ${text}.</p>`;
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;',
        '"': '&quot;', "'": '&#39;'
    })[m]);
}
