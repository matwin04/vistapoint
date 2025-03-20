document.addEventListener("DOMContentLoaded",async()=>{
	const map = L.map("map").setView([0,0],2);
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution: "&copy; OpenStreetMap contributors"
	}).addTo(map);
})