import { getAllPOIs, addPOI } from "/scripts/api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const map = L.map("map").setView([0, 0], 2); // Default view

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    async function loadPOIs() {
        const pois = await getAllPOIs();
        pois.forEach(poi => {
            L.marker([poi.lat, poi.lng])
                .addTo(map)
                .bindPopup(`<b>${poi.name}</b><br>${poi.description || "No description"}`);
        });
    }
    loadPOIs();

    // ✅ Fix Map Resize Issue
    setTimeout(() => {
        map.invalidateSize();
    }, 500);

    // ✅ Enable Clicking on Map to Set Lat/Lng
    let selectingLocation = false;

    document.getElementById("findOnMap").addEventListener("click", () => {
        selectingLocation = true;
        alert("Click on the map to select a location.");
    });

    map.on("click", (event) => {
        if (!selectingLocation) return;

        const { lat, lng } = event.latlng;
        document.getElementById("latitude").value = lat.toFixed(6);
        document.getElementById("longitude").value = lng.toFixed(6);
        selectingLocation = false;
    });

    // ✅ Add POI from Form Submission
    document.getElementById("addPoiForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;
        const lat = parseFloat(document.getElementById("latitude").value);
        const lng = parseFloat(document.getElementById("longitude").value);

        if (!name || isNaN(lat) || isNaN(lng)) {
            alert("Please enter valid details.");
            return;
        }

        const newPoi = { name, description, lat, lng, category };

        try {
            await addPOI(newPoi);
            alert("POI added successfully!");
            document.getElementById("addPoiForm").reset();
            loadPOIs(); // Refresh the map
        } catch (error) {
            console.error("Error adding POI:", error);
        }
    });
});