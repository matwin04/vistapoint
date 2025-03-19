export function getAllPOIs() {
    return fetch("https://vistapoint.vercel.app/api/pois", {
        method: "GET",
        headers: {}
    })
    .then((res) => res.json())
    .then(console.log.bind(console))
    .catch(console.error.bind(console));
}
