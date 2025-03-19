export function getAllPOIs() {
    return fetch("https://vistapoint.vercel.app/api/pois", {
        method: "GET",
        headers: {}
    })
    .then((res) => res.json())
    .then(console.log.bind(console))
    .catch(console.error.bind(console));
}

export function addPOI(poiData) {
    return fetch("https://vistapoint.vercel.app/api/pois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(poiData)
    })
    .then((res) => res.json())
    .then(console.log.bind(console))
    .catch(console.error.bind(console));
}