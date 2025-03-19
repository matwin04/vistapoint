import { addPOI, getAllPOIs } from "/scripts/api.js";

document.addEventListener("DOMContentLoaded",async()=>{
    const map = L.map("map").setView([0, 0], 2);

    // Load Carto Light Basemap
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    // Custom Material Icon for user's location
    const myIcon = L.icon({
        iconUrl: "https://fonts.gstatic.com/s/i/materialicons/location_on/v15/24px.svg",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    // Function to locate user
    function locateUser() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    // Update map view
                    map.setView([lat, lng], 15);

                    // Add a marker at user's location
                    L.marker([lat, lng], { icon: myIcon })
                        .addTo(map)
                        .bindPopup("<b>You are here!</b>").openPopup();
                },
                (error) => {
                    alert("Geolocation failed: " + error.message);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    // Call function to locate user
    locateUser();
    async function loadPOIs() {
        const pois = await getAllPOIs();
        pois.forEach(poi => {
            L.marker([poi.lat, poi.lng])
                .addTo(map)
                .bindPopup(`<b>${poi.name}</b><br>${poi.description || "No description"}`);
        });
    }
    loadPOIs();
    let selectingLocation = false;
    document.getElementById("findOnMap").addEventListener("click",()=>{
        selectingLocation=true;
        alert("Click On Map to select a location");
    });
    map.on("click",(event)=>{
        if (!selectingLocation) return;
        const {lat,lng}=event.latlng;
        document.getElementById("latitude").value = lat.toFixed(6);
        document.getElementById("longitude").value = lng.toFixed(6);
        selectingLocation = false;
    })
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
            await addPOI(newPoi);
            alert("POI ADDED");
            document.getElementById("addPoiForm").reset();
            loadPOIs();
        } catch (error) {
            console.error("ERR ADDING POI",error);
        }
    });
});