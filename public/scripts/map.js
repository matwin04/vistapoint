const { response } = require("../../server");

document.addEventListener("DOMContentLoaded",()=>{
    const map = L.map("map").setView([0,0],5);
    // Load OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    //FETCH POI
    
});