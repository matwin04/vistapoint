import { addPOI, getAllPOIs } from "./api.js";

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

    document.getElementById("addPoiForm").addEventListener("submit",async(event)=>{
        event.preventDefault();
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;
        const lat = parseFloat(document.getElementById("latitude").value);
        const lng = parseFloat(document.getElementById("longitude").value);
        if (!name||isNaN(lat)||isNaN(lng)) {
            alert("PLEASE ENTER VALID DETAILS");
            return;
        }

        const newPoi = {name,description,lat,lng,category};
        try{
            await addPOI(newPOI);
            alert("POI ADDED");
            document.getElementById("addPoiForm").reset();
            loadPOIs();
        } catch (error) {
            console.error("ERR ADDING POI",error);
        }
    });
});