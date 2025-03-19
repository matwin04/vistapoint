export async function getAllPOIs() {
    try {
        const res = await fetch("https://vistapoint.vercel.app/api/pois");
        if (!res.ok) throw new Error("Failed to fetch POIs");
        const data = await res.json();
        console.log("POIs:", data); // ✅ Logs fetched POIs
        return Array.isArray(data) ? data : []; // ✅ Always return an array
    } catch (error) {
        console.error("Error fetching POIs:", error);
        return []; // ✅ Return an empty array instead of `undefined`
    }
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