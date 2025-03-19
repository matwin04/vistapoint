import { getAllPOIs } from "./api";

document.addEventListener("DOMContentLoaded",async()=>{
    const map = L.map("map").setView([0, 0], 2); // Default view over US

    // Load OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
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
})